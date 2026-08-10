import User from "../models/User.js";
import Referral from "../models/Referral.js";
import CONSTANTS from "../constants/constants.js";
import ConstantsManager from "./constantsManager.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import {
  generateReferralCode,
  normalizeReferralCode,
} from "../utils/referralCodeUtils.js";

const maskPhone = (contactNumber) => {
  const digits = String(contactNumber ?? "").replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
};

const displayLabelForUser = (user) => {
  const name = String(user?.displayName || "").trim();
  if (name) return name;
  return maskPhone(user?.contactNumber);
};

class ReferralManager {
  static assignUniqueReferralCode = async (userId) => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const referralCode = generateReferralCode();
      try {
        const user = await User.findOneAndUpdate(
          { _id: userId, referralCode: { $in: [null, ""] } },
          { referralCode },
          { new: true }
        );
        if (user?.referralCode) return user.referralCode;

        const existing = await User.findById(userId).select("referralCode");
        if (existing?.referralCode) return existing.referralCode;
      } catch (error) {
        if (error?.code !== 11000) throw error;
      }
    }
    throw new ErrorHandler("Could not generate referral code", 500);
  };

  static registerNewUser = async ({
    userId,
    referralCodeInput,
    displayName,
  }) => {
    const trimmedName = String(displayName || "").trim().slice(0, 80);
    const userUpdate = {};
    if (trimmedName) userUpdate.displayName = trimmedName;

    if (Object.keys(userUpdate).length) {
      await User.findByIdAndUpdate(userId, userUpdate);
    }

    await this.assignUniqueReferralCode(userId);

    const normalizedCode = normalizeReferralCode(referralCodeInput);
    if (!normalizedCode) return;

    const referrer = await User.findOne({ referralCode: normalizedCode });
    if (!referrer) {
      throw new ErrorHandler("Invalid referral code", 400);
    }
    if (String(referrer._id) === String(userId)) {
      throw new ErrorHandler("You cannot use your own referral code", 400);
    }

    try {
      await Referral.create({
        referrerUserId: referrer._id,
        refereeUserId: userId,
        referrerDisplayName: displayLabelForUser(referrer),
        refereeDisplayName: trimmedName,
        status: CONSTANTS.REFERRAL_STATUS.PENDING,
      });
      await User.findByIdAndUpdate(userId, { referredByUserId: referrer._id });
    } catch (error) {
      if (error?.code === 11000) {
        throw new ErrorHandler("Referral already recorded for this account", 400);
      }
      throw error;
    }
  };

  static ensureReferralCodeForExistingUser = async (userId) => {
    const user = await User.findById(userId).select("referralCode");
    if (!user) return null;
    if (user.referralCode) return user.referralCode;
    return this.assignUniqueReferralCode(userId);
  };

  static handleOrderClosed = async (tax) => {
    if (!tax?.userId || tax.status !== CONSTANTS.ORDER_STATUS.CLOSED) return;

    const referral = await Referral.findOne({
      refereeUserId: tax.userId,
      status: {
        $in: [
          CONSTANTS.REFERRAL_STATUS.PENDING,
          CONSTANTS.REFERRAL_STATUS.REVERTED,
        ],
      },
    });

    if (!referral) return;

    referral.status = CONSTANTS.REFERRAL_STATUS.SUCCESSFUL;
    referral.qualifyingOrderId = tax._id;
    referral.qualifyingOrderClosedAt = new Date();
    referral.revertedAt = undefined;
    await referral.save();
  };

  static handleOrderDisqualified = async (tax) => {
    if (!tax?._id) return;

    const referral = await Referral.findOne({
      qualifyingOrderId: tax._id,
      status: CONSTANTS.REFERRAL_STATUS.SUCCESSFUL,
    });

    if (!referral) return;

    referral.status = CONSTANTS.REFERRAL_STATUS.REVERTED;
    referral.revertedAt = new Date();
    referral.qualifyingOrderId = undefined;
    referral.qualifyingOrderClosedAt = undefined;
    await referral.save();
  };

  static getLeaderboardWindow = async () => {
    const enabled = await ConstantsManager.getBooleanConstant(
      CONSTANTS.DB_CONSTANT_KEYS.REFERRAL_LEADERBOARD_ENABLED,
      true
    );
    const startRaw = await ConstantsManager.getConstantValue(
      CONSTANTS.DB_CONSTANT_KEYS.REFERRAL_LEADERBOARD_START_DATE,
      ""
    );
    const startDate = startRaw ? new Date(startRaw) : null;
    const endDate = new Date();
    return { enabled, startDate, endDate };
  };

  static getMyReferralSummary = async (userId) => {
    await this.ensureReferralCodeForExistingUser(userId);
    const user = await User.findById(userId).select(
      "referralCode displayName contactNumber referredByUserId"
    );
    if (!user) throw new ErrorHandler("User not found", 404);

    const [pending, successful, reverted] = await Promise.all([
      Referral.countDocuments({
        referrerUserId: userId,
        status: CONSTANTS.REFERRAL_STATUS.PENDING,
      }),
      Referral.countDocuments({
        referrerUserId: userId,
        status: CONSTANTS.REFERRAL_STATUS.SUCCESSFUL,
      }),
      Referral.countDocuments({
        referrerUserId: userId,
        status: CONSTANTS.REFERRAL_STATUS.REVERTED,
      }),
    ]);

    let referredBy = null;
    if (user.referredByUserId) {
      const referrer = await User.findById(user.referredByUserId).select(
        "displayName contactNumber referralCode"
      );
      if (referrer) {
        referredBy = {
          displayLabel: displayLabelForUser(referrer),
          referralCode: referrer.referralCode,
        };
      }
    }

    return {
      referralCode: user.referralCode,
      displayName: user.displayName || "",
      counts: { pending, successful, reverted, total: pending + successful + reverted },
      referredBy,
    };
  };

  static LEADERBOARD_TOP_LIMIT = 50;

  static getReferrerRankInWindow = async (match, successfulReferrals) => {
    const aheadRows = await Referral.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$referrerUserId",
          successfulReferrals: { $sum: 1 },
        },
      },
      { $match: { successfulReferrals: { $gt: successfulReferrals } } },
      { $count: "ahead" },
    ]);
    const ahead = aheadRows[0]?.ahead ?? 0;
    return ahead + 1;
  };

  static getLeaderboard = async (viewerUserId) => {
    const { enabled, startDate, endDate } = await this.getLeaderboardWindow();
    if (!enabled) {
      return { enabled: false, startDate, endDate, entries: [] };
    }
    if (!startDate || Number.isNaN(startDate.getTime())) {
      return { enabled: true, startDate: null, endDate, entries: [] };
    }

    const match = {
      status: CONSTANTS.REFERRAL_STATUS.SUCCESSFUL,
      qualifyingOrderClosedAt: { $gte: startDate, $lte: endDate },
    };

    const rows = await Referral.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$referrerUserId",
          successfulReferrals: { $sum: 1 },
        },
      },
      { $sort: { successfulReferrals: -1 } },
      { $limit: this.LEADERBOARD_TOP_LIMIT },
    ]);

    const viewerId = String(viewerUserId);
    const userIds = rows.map((r) => r._id);
    const users = await User.find({ _id: { $in: userIds } }).select(
      "displayName contactNumber createdAt"
    );
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const entries = rows.map((row, index) => {
      const id = String(row._id);
      const u = userMap.get(id);
      return {
        rank: index + 1,
        userId: id,
        displayLabel: displayLabelForUser(u),
        successfulReferrals: row.successfulReferrals,
        isCurrentUser: id === viewerId,
        createdAt: u?.createdAt || null,
      };
    });

    const inTop50 = entries.some((e) => e.isCurrentUser);
    let currentUserStanding = null;

    if (!inTop50) {
      const viewer = await User.findById(viewerUserId).select(
        "displayName contactNumber createdAt"
      );
      const successfulReferrals = await Referral.countDocuments({
        ...match,
        referrerUserId: viewerUserId,
      });
      const rank = await this.getReferrerRankInWindow(
        match,
        successfulReferrals
      );
      currentUserStanding = {
        rank,
        displayLabel: displayLabelForUser(viewer),
        successfulReferrals,
        isCurrentUser: true,
        createdAt: viewer?.createdAt || null,
      };
    }

    return {
      enabled: true,
      startDate,
      endDate,
      limit: this.LEADERBOARD_TOP_LIMIT,
      entries,
      currentUserStanding,
    };
  };

  static buildAdminReferralQuery = async ({ status, search } = {}) => {
    const query = {};
    if (status && Object.values(CONSTANTS.REFERRAL_STATUS).includes(status)) {
      query.status = status;
    }

    if (search?.trim()) {
      const term = search.trim();
      const nameRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const users = await User.find({
        $or: [
          { referralCode: normalizeReferralCode(term) },
          { displayName: nameRegex },
          ...(Number.isFinite(Number(term))
            ? [{ contactNumber: Number(term) }]
            : []),
        ],
      }).select("_id");
      const ids = users.map((u) => u._id);
      const orClauses = [
        { refereeDisplayName: nameRegex },
        { referrerDisplayName: nameRegex },
      ];
      if (ids.length) {
        orClauses.push(
          { referrerUserId: { $in: ids } },
          { refereeUserId: { $in: ids } }
        );
      }
      query.$or = orClauses;
    }

    return { query, noMatches: false };
  };

  static listReferralsForAdmin = async ({
    page = 1,
    limit = CONSTANTS.ITEMS_PER_PAGE,
    status,
    search,
  }) => {
    const { query, noMatches } = await this.buildAdminReferralQuery({
      status,
      search,
    });

    if (noMatches) {
      return { referrals: [], total: 0, page, limit };
    }

    const skip = (page - 1) * limit;
    const [referrals, total] = await Promise.all([
      Referral.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("referrerUserId", "contactNumber displayName referralCode")
        .populate("refereeUserId", "contactNumber displayName referralCode")
        .lean(),
      Referral.countDocuments(query),
    ]);

    return { referrals, total, page, limit };
  };

  static getAdminStats = async ({ search } = {}) => {
    const { query, noMatches } = await this.buildAdminReferralQuery({ search });

    if (noMatches) {
      const totalUsersWithCode = await User.countDocuments({
        referralCode: { $exists: true, $ne: "" },
      });
      return {
        pending: 0,
        successful: 0,
        reverted: 0,
        totalReferrals: 0,
        totalUsersWithCode,
      };
    }

    const baseQuery = query || {};
    const [pending, successful, reverted, totalUsersWithCode] =
      await Promise.all([
        Referral.countDocuments({
          ...baseQuery,
          status: CONSTANTS.REFERRAL_STATUS.PENDING,
        }),
        Referral.countDocuments({
          ...baseQuery,
          status: CONSTANTS.REFERRAL_STATUS.SUCCESSFUL,
        }),
        Referral.countDocuments({
          ...baseQuery,
          status: CONSTANTS.REFERRAL_STATUS.REVERTED,
        }),
        User.countDocuments({ referralCode: { $exists: true, $ne: "" } }),
      ]);

    return {
      pending,
      successful,
      reverted,
      totalReferrals: pending + successful + reverted,
      totalUsersWithCode,
    };
  };
}

export default ReferralManager;

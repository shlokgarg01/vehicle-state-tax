import crypto from "crypto";

const REFERRAL_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REFERRAL_CODE_LENGTH = 6;

export const normalizeReferralCode = (code) => String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

export const generateReferralCode = () => {
  let code = "";
  const bytes = crypto.randomBytes(REFERRAL_CODE_LENGTH);
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i += 1) {
    code += REFERRAL_CODE_CHARS[bytes[i] % REFERRAL_CODE_CHARS.length];
  }
  return code;
};

const CONSTANTS = {
  ITEMS_PER_PAGE: 25,
  ORDER_STATUS: {
    CREATED: "created",
    PAYMENT_PENDING: "payment_pending",
    CONFIRMED: "confirmed",
    CLOSED: "closed",
    CANCELLED: "cancelled",
  },
  PAYMENT: {
    TRANSACTION_STATUS: {
      SUCCESS: "SUCCESS",
    },
  },
  PAYMENT_GATEWAY: {
    PAY0: "pay0",
    PAYINDIA: "payindia",
    SBIEPAY: "sbiepay",
  },
  PAYMENT_METHOD: {
    GATEWAY: "gateway",
    WALLET: "wallet",
    UPI: "upi",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
  },
  AUTO_CANCEL_REASONS: {
    WALLET_CHECKOUT_CREATE_FAILED: "[AUTO] Wallet checkout failed while creating the order",
    WALLET_GATEWAY_LINK_FAILED: "[AUTO] Payment gateway link could not be created",
    HYBRID_GATEWAY_TIMEOUT: "[AUTO] Wallet + gateway: payment not completed",
    WALLET_UPI_CHECKOUT_CREATE_FAILED: "[AUTO] Wallet + UPI checkout failed while creating the order",
    UPI_PAYMENT_TIMEOUT: "[AUTO] UPI payment not received within 48 hours (wallet refunded)",
  },
  WALLET_TRANSACTION_TYPE: {
    TAX_DEBIT: "tax_debit",
    REFUND_CREDIT: "refund_credit",
    PAYMENT_ROLLBACK: "payment_rollback",
    WITHDRAWAL_HOLD: "withdrawal_hold",
    WITHDRAWAL_DEBIT: "withdrawal_debit",
    WITHDRAWAL_RELEASE: "withdrawal_release",
  },
  WITHDRAWAL_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  },
  TAX_CATEGORIES: {
    ROAD_TAX: "road_tax",
    BORDER_TAX: "border_tax",
    ALL_INDIA_PERMIT: "all_india_permit",
    ALL_INDIA_TAX: "all_india_tax",
    LOADING_VEHICLE: "loading_vehicle",
  },
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },
  USER_ROLES: {
    ADMIN: "admin",
    MANAGER: "manager",
  },
  /** Username allowed to reset passwords for admin accounts (matches frontend). */
  SUPER_ADMIN_USERNAME: "shlokAdmin",
  MODES: {
    BORDER_TAX: "border_tax",
    ROAD_TAX: "road_tax",
    ALL_INDIA_PERMIT: "all_india_permit",
    ALL_INDIA_TAX: "all_india_tax",
    LOADING_VEHICLE: "loading_vehicle",
  },
  TAX_MODES: {
    DAYS: "days",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    QUARTERLY: "quarterly",
  },
  SEAT_CAPACITY: {
    FOUR_PLUS_ONE: "4+1",
    FIVE_PLUS_ONE: "5+1",
    SIX_PLUS_ONE: "6+1",
    SEVEN_PLUS_ONE: "7+1",
    TWELVE_PLUS_ONE: "12+1",
  },
  VEHICLE_TYPES: {
    LIGHT: "light goods vehicle",
    MEDIUM: "medium goods vehicle",
    HEAVY: "heavy goods vehicle",
  },
  WEIGHT: {
    HUNDRED_KG: 100,
    TWO_HUNDRED_KG: 200,
    THREE_HUNDRED_KG: 300,
    FOUR_HUNDRED_KG: 400,
    FIVE_HUNDRED_KG: 500,
  },
  WALLET_REFUND_ELIGIBLE_FROM: "2026-06-19",
  PUSH_NOTIFICATION_AUDIENCE: {
    ALL: "all",
  },
  PUSH_NOTIFICATION_STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    FAILED: "failed",
  },
  FCM_BATCH_SIZE: 500,
  DB_CONSTANT_KEYS: {
    PAYMENT_GATEWAY: "PAYMENT_GATEWAY",
    IS_RAZORPAY_LIVE: "IS_RAZORPAY_LIVE",
    BUSINESS_UPI_ID: "BUSINESS_UPI_ID",
    UPI_PAYEE_NAME: "UPI_PAYEE_NAME",
    REFERRAL_LEADERBOARD_ENABLED: "REFERRAL_LEADERBOARD_ENABLED",
    REFERRAL_LEADERBOARD_START_DATE: "REFERRAL_LEADERBOARD_START_DATE",
    REFERRAL_POSTER_URL: "REFERRAL_POSTER_URL",
    REFERRAL_DETAILS_TEXT: "REFERRAL_DETAILS_TEXT",
  },
  REFERRAL_STATUS: {
    PENDING: "pending",
    SUCCESSFUL: "successful",
    REVERTED: "reverted",
  },
};

export default CONSTANTS;

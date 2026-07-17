const CONSTANTS = {
  ITEMS_PER_PAGE: 25,
  ORDER_STATUS: {
    CREATED: "created",
    CONFIRMED: "confirmed",
    CLOSED: "closed",
    CANCELLED: "cancelled",
  },
  PAYMENT: {
    TRANSACTION_STATUS: {
      SUCCESS: "SUCCESS",
    },
  },
  PAYMENT_METHOD: {
    GATEWAY: "gateway",
    WALLET: "wallet",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
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
    IS_RAZORPAY_LIVE: "IS_RAZORPAY_LIVE",
  },
};

export default CONSTANTS;

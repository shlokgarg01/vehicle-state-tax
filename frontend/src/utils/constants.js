const Constants = {
  ITEMS_PER_PAGE: 25,
  ORDER_STATUS: {
    CREATED: 'created',
    PAYMENT_PENDING: 'payment_pending',
    CONFIRMED: 'confirmed',
    CLOSED: 'closed',
    CANCELLED: 'cancelled',
  },
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
  },
  /** Username that may set passwords when editing admin users (must match backend). */
  SUPER_ADMIN_USERNAME: 'shlokAdmin',
  MODES: {
    BORDER_TAX: 'border_tax',
    ROAD_TAX: 'road_tax',
    ALL_INDIA_PERMIT: 'all_india_permit',
    ALL_INDIA_TAX: 'all_india_tax',
    LOADING_VEHICLE: 'loading_vehicle',
  },
  TAX_MODES: {
    DAYS: 'days',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly',
  },
  SEAT_CAPACITY: {
    FOUR_PLUS_ONE: '4+1',
    FIVE_PLUS_ONE: '5+1',
    SIX_PLUS_ONE: '6+1',
    SEVEN_PLUS_ONE: '7+1',
    TWELVE_PLUS_ONE: '12+1',
  },
  VEHICLE_TYPES: {
    LIGHT: 'light goods vehicle',
    MEDIUM: 'medium goods vehicle',
    HEAVY: 'heavy goods vehicle',
  },
  MODE_OPTIONS: {
    STATE: 'State',
    VEHICLE_TYPE: 'Vehicle Type',
    WEIGHT: 'Weight',
    ALL_INDIA: 'All India',
  },
  WEIGHT: {
    HUNDRED_KG: 100,
    TWO_HUNDRED_KG: 200,
    THREE_HUNDRED_KG: 300,
    FOUR_HUNDRED_KG: 400,
    FIVE_HUNDRED_KG: 500,
  },
  WALLET_REFUND_ELIGIBLE_FROM: '2026-06-19',
  CONSTANT_KEYS: {
    SEND_WELCOME_WHATSAPP: 'SEND_WELCOME_WHATSAPP',
    SEND_TAX_WHATSAPP: 'SEND_TAX_WHATSAPP',
    REFUND_PASSWORD: 'REFUND_PASSWORD',
    REFUND_DEDUCTION_PERCENT: 'REFUND_DEDUCTION_PERCENT',
    NOTICE: 'NOTICE',
    APP_MIN_VERSION: 'min_app_version',
    IS_RAZORPAY_LIVE: 'IS_RAZORPAY_LIVE',
    BUSINESS_UPI_ID: 'BUSINESS_UPI_ID',
    UPI_PAYEE_NAME: 'UPI_PAYEE_NAME',
  },
}

export default Constants

const CONSTANTS = {
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

  MODES: {
    BORDER_TAX: "border_tax",
    ROAD_TAX: "road_tax",
    ALL_INDIA_PERMIT: "all_india_permit",
    ALL_INDIA_TAX: "all_india_tax",
    LOADING_VEHICLE: "loading_vehicle",
  },

  TAX_MODES: {
    DAYS: "days",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    QUARTERLY: "quarterly",
  },

  SEAT_CAPACITY: {
    FOUR_PLUS_ONE: "4+1",
    FIVE_PLUS_ONE: "5+1",
    SIX_PLUS_ONE: "6+1",
    SEVEN_PLUS_ONE: "7+1",
  },

  VEHICLE_TYPES: {
    LIGHT: "light goods vehicle",
    MEDIUM: "medium goods vehicle",
    HEAVY: "heavy goods vehicle",
  },
};

export default CONSTANTS;

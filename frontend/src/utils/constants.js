const Constants = {
  ITEMS_PER_PAGE: 10,
  ORDER_STATUS: {
    CREATED: 'created',
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
}

export default Constants

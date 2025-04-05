import COLLECTION_NAMES from "./collection";

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

export const SEAT_CAPACITY = {};
export const TAX_MODES = {
  YEARLY: "yearly",
  QUARTERLY: "quarterly",
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  DAILY: "daily",
  CUSTOM: "custom",
};

export const LOADING_VEHICLE_TYPES = {
  LIGHT: "light goods vehicle",
  MEDIUM: "medium goods vehicle",
  HEAVY: "heavy goods vehicle",
};

export const taxModels = {
  BorderTax: COLLECTION_NAMES.BORDER_TAX,
  RoadTax: COLLECTION_NAMES.ROAD_TAX,
  AllIndiaPermit: COLLECTION_NAMES.ALL_INDIA_PERMIT,
  AllIndiaTax: COLLECTION_NAMES.ALL_INDIA_TAX,
  LoadingVehicle: COLLECTION_NAMES.LOADING_VEHICLE,
};

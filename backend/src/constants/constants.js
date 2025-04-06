import COLLECTION_NAMES from "./collection.js";

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

export const SEAT_CAPACITY = {
  FOUR_PLUS_ONE: "4+1",
  FIVE_PLUS_ONE: "5+1",
  SIX_PLUS_ONE: "6+1",
  SEVEN_PLUS_ONE: "7+1",
};
export const TAX_MODES = {
  YEARLY: "yearly",
  QUARTERLY: "quarterly",
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  DAYS: "days",
  CUSTOM: "custom",
};

export const LOADING_VEHICLE_TYPES = {
  LIGHT: "light goods vehicle",
  MEDIUM: "medium goods vehicle",
  HEAVY: "heavy goods vehicle",
};
export const TAX_MODELS = {
  BorderTax: COLLECTION_NAMES.BORDER_TAX,
  RoadTax: COLLECTION_NAMES.ROAD_TAX,
  AllIndiaPermit: COLLECTION_NAMES.ALL_INDIA_PERMIT,
  AllIndiaTax: COLLECTION_NAMES.ALL_INDIA_TAX,
  LoadingVehicle: COLLECTION_NAMES.LOADING_VEHICLE,
};

export const MODES = {
  ROAD_TAX: "roadTax",
  BORDER_TAX: "borderTax",
  LOADING_VEHICLE: "loadingVehicle",
  ALL_INDIA: "allIndia", // used in Prices
  LOADING_VEHICLE: "loadingVeh", // used in Prices
};

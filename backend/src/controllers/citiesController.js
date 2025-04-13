import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Cities from "../models/Cities.js";

export const createCities = catchAsyncErrors(async (req, res) => {
  let { state, cities } = req.body;

  if (!state || !Array.isArray(cities) || cities.length === 0) {
    return res.status(400).json({
      success: false,
      message: "State and cities are required",
    });
  }

  cities = cities.map((city) => city.trim());

  let existingState = await Cities.findOne({ state: state.toLowerCase().replace(/\s+/g, "_") });
  if (existingState) {
    const newCities = cities.filter(
      (city) => !existingState.cities.includes(city)
    );

    if (newCities.length > 0) {
      existingState.cities.push(...newCities);
      await existingState.save();
    }

    return res.status(200).json({
      success: true,
      message:
        newCities.length > 0
          ? "New cities added to existing state"
          : "All cities already exist for this state",
    });
  } else {
    await Cities.create({ state, cities });

    return res.status(201).json({
      success: true,
      message: "New state and cities added successfully",
    });
  }
});


export const getCitiesOfState = catchAsyncErrors(async (req, res) => {
  const state = req.params.state
  if (!state) res.status(400).json({
    success: false,
    message: "State is required",
  })

  let response = await Cities.findOne({ state: state.toLowerCase().replace(/\s+/g, "_") });
  res.status(200).json({
    success: true,
    message: "Cities fetched successfully",
    state,
    cities: response?.cities
  });
});


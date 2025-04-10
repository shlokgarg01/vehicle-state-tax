import BANNER_CONSTANTS from '../constants/bannerConstants'

// create banner
export const createBannerReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_CONSTANTS.CREATE_BANNER_REQUEST:
      return { loading: true }
    case BANNER_CONSTANTS.CREATE_BANNER_SUCCESS:
      return { loading: false, success: true, banner: action.payload }
    case BANNER_CONSTANTS.CREATE_BANNER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// get banner
const initialState = {
  data: [],
  totalBanners: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
}
export const getBannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case BANNER_CONSTANTS.GET_BANNERS_REQUEST:
      return { ...state, loading: true }
    case BANNER_CONSTANTS.GET_BANNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        totalBanners: action.payload.totalBanners,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      }
    case BANNER_CONSTANTS.GET_BANNERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

// delete banner
export const deleteBannerReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_CONSTANTS.DELETE_BANNER_REQUEST:
      return { loading: true }
    case BANNER_CONSTANTS.DELETE_BANNER_SUCCESS:
      return { loading: false, success: true, deletedId: action.payload }
    case BANNER_CONSTANTS.DELETE_BANNER_FAIL:
      return { loading: false, error: action.payload }
    case BANNER_CONSTANTS.DELETE_BANNER_RESET:
      return {}
    default:
      return state
  }
}

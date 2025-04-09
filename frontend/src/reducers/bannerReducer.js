import BANNER_CONSTANTS from '../constants/bannerConstants'

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

export const getBannerReducer = (state = { data: [], totalBanners: 0 }, action) => {
  switch (action.type) {
    case BANNER_CONSTANTS.GET_BANNERS_REQUEST:
      return { loading: true }
    case BANNER_CONSTANTS.GET_BANNERS_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        totalBanners: action.payload.totalBanners,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      }
    case BANNER_CONSTANTS.GET_BANNERS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const deleteBannerReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_CONSTANTS.DELETE_BANNER_REQUEST:
      return { loading: true }
    case BANNER_CONSTANTS.DELETE_BANNER_SUCCESS:
      return { loading: false, success: true, deletedId: action.payload }
    case BANNER_CONSTANTS.DELETE_BANNER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

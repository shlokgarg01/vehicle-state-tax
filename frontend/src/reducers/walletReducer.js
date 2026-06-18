import { WALLET_CONSTANTS } from '../constants/walletConstants'

export const withdrawalsReducer = (
  state = { withdrawals: [], total: 0, loading: false },
  action
) => {
  switch (action.type) {
    case WALLET_CONSTANTS.GET_WITHDRAWALS_REQUEST:
      return { ...state, loading: true, error: null }
    case WALLET_CONSTANTS.GET_WITHDRAWALS_SUCCESS:
      return {
        loading: false,
        withdrawals: action.payload.withdrawals,
        total: action.payload.total,
        counts: action.payload.counts,
        page: action.payload.page,
        perPage: action.payload.perPage,
        totalPages: Math.ceil(action.payload.total / action.payload.perPage),
      }
    case WALLET_CONSTANTS.GET_WITHDRAWALS_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export const completeWithdrawalReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_REQUEST:
      return { loading: true, success: false, error: null }
    case WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_SUCCESS:
      return { loading: false, success: true, withdrawal: action.payload }
    case WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_FAIL:
      return { loading: false, error: action.payload }
    case WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_RESET:
      return {}
    default:
      return state
  }
}

export const rejectWithdrawalReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_CONSTANTS.REJECT_WITHDRAWAL_REQUEST:
      return { loading: true, success: false, error: null }
    case WALLET_CONSTANTS.REJECT_WITHDRAWAL_SUCCESS:
      return { loading: false, success: true, withdrawal: action.payload }
    case WALLET_CONSTANTS.REJECT_WITHDRAWAL_FAIL:
      return { loading: false, error: action.payload }
    case WALLET_CONSTANTS.REJECT_WITHDRAWAL_RESET:
      return {}
    default:
      return state
  }
}

export const refundToWalletReducer = (state = {}, action) => {
  const taxId = action.meta?.taxId
  switch (action.type) {
    case WALLET_CONSTANTS.REFUND_TO_WALLET_REQUEST:
      return { loading: true, success: false, error: null, currentTaxId: taxId }
    case WALLET_CONSTANTS.REFUND_TO_WALLET_SUCCESS:
      return { loading: false, success: true, tax: action.payload, currentTaxId: taxId }
    case WALLET_CONSTANTS.REFUND_TO_WALLET_FAIL:
      return { loading: false, error: action.payload, currentTaxId: taxId }
    case WALLET_CONSTANTS.REFUND_TO_WALLET_RESET:
      return {}
    default:
      return state
  }
}

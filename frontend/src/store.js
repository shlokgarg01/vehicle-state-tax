import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

const initialState = { sidebarShow: true }

const toggleSidebar = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const reducer = combineReducers({
  sidebarShow: toggleSidebar,
})

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))
export default store

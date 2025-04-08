import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
<<<<<<< HEAD
<<<<<<< HEAD
=======
import * as userReducer from './reducers/userReducer'
import * as taxReducer from './reducers/taxReducer'
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
import * as userReducer from './reducers/userReducer'
import * as taxReducer from './reducers/taxReducer'
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

  user: userReducer.loadUserReducer,

  createState: taxReducer.createStateReducer,
  allStates: taxReducer.allStatesReducer,
  state: taxReducer.updateStateReducer,
<<<<<<< HEAD
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
})

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))
export default store

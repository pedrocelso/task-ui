import { combineReducers, createStore } from 'redux'
import { loginReducer } from './components/login/login-reducers'

const rootReducer = combineReducers({
  login: loginReducer
})

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store
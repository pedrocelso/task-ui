import { combineReducers, createStore } from 'redux'
import { loginReducer } from './components/login/login-reducers'
import { editorReducer } from './components/task/editor-reducers'

const rootReducer = combineReducers({
  login: loginReducer,
  editor: editorReducer
})

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store
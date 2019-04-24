import { AUTHENTICATE, DEAUTHENTICATE, LoginActionTypes, LoginState, SET_EMAIL, SET_NAME } from './login-types' 

const initialState: LoginState = {
  authenticated: false,
  name: ``,
  email: ``
}

export function loginReducer(
  state = initialState,
  action: LoginActionTypes
): LoginState {
  switch (action.type) {
    case AUTHENTICATE:
    case SET_NAME:
    case SET_EMAIL:
      return {
        ...state, ...action.payload
      }
    case DEAUTHENTICATE:
      return {
        authenticated: false,
        name: ``,
        email: ``
      }
    default:
      return state
  }
}
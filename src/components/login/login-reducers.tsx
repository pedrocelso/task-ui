import { AUTHENTICATE, DEAUTHENTICATE, LoginActionTypes, LoginState } from './login-types' 

const initialState: LoginState = {
  authenticated: false,
  token: ``
}

export function loginReducer(
  state = initialState,
  action: LoginActionTypes
): LoginState {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state, ...action.payload
      }
    case DEAUTHENTICATE:
      return {
        authenticated: false,
        token: ``,
      }
    default:
      return state
  }
}
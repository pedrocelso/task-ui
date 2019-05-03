import { AUTHENTICATE, DEAUTHENTICATE, LoginActionTypes } from './login-types' 

export function authenticate(token: string): LoginActionTypes {
  return {
    type: AUTHENTICATE,
    payload: {
      authenticated: true,
      token
    }
  }
}

export function deauthenticate(): LoginActionTypes {
  return {
    type: DEAUTHENTICATE,
    payload: {
      authenticated: false
    }
  }
}

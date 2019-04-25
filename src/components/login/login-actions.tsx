import { AUTHENTICATE, DEAUTHENTICATE, LoginActionTypes, SET_EMAIL, SET_NAME } from './login-types' 

export function authenticate(name?: string, email?: string): LoginActionTypes {
  return {
    type: AUTHENTICATE,
    payload: {
      authenticated: true,
      name,
      email
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

export function setName(name: string): LoginActionTypes {
  return {
    type: SET_NAME,
    payload: {
      name
    }
  }
}

export function setEmail(email: string): LoginActionTypes {
  return {
    type: SET_EMAIL,
    payload: {
      email
    }
  }
}
export interface LoginState {
  authenticated: boolean;
  name: string;
  email: string;
}

export const SET_NAME = 'SET_NAME'
export const SET_EMAIL = 'SET_EMAIL'
export const AUTHENTICATE = 'AUTHENTICATE'
export const DEAUTHENTICATE = 'DEAUTHENTICATE'

interface SetNameAction {
  type: typeof SET_NAME
  payload: {
    name: string
  }
}

interface SetEmailAction {
  type: typeof SET_EMAIL
  payload: {
    email: string
  }
}

interface AuthenticateAction {
  type: typeof AUTHENTICATE
  payload: {
    authenticated: boolean
    name?: string
    email?: string
  }
}

interface DeauthenticateAction {
  type: typeof DEAUTHENTICATE
  payload: {
    authenticated: boolean
  }
}

export type LoginActionTypes = SetNameAction | SetEmailAction | AuthenticateAction | DeauthenticateAction
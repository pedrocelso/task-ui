export interface LoginState {
  authenticated: boolean;
  token: string;
}

export const AUTHENTICATE = 'AUTHENTICATE'
export const DEAUTHENTICATE = 'DEAUTHENTICATE'

interface AuthenticateAction {
  type: typeof AUTHENTICATE
  payload: {
    authenticated: boolean
    token: string
  }
}

interface DeauthenticateAction {
  type: typeof DEAUTHENTICATE
  payload: {
    authenticated: boolean
  }
}

export type LoginActionTypes = AuthenticateAction | DeauthenticateAction
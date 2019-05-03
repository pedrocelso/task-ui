import * as actions from './login-actions'
import * as types from './login-types'

describe('login-actions', () => {
  it('.authenticate() - should create an action to authenticate', () => {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`
    const expectedAction = {
      type: types.AUTHENTICATE,
      payload: {
        authenticated: true,
        token
      }
    }
    expect(actions.authenticate(token)).toEqual(expectedAction)
  })

  it('.deauthenticate() - should create an action to deauthenticate', () => {
    const expectedAction = {
      type: types.DEAUTHENTICATE,
      payload: {
        authenticated: false
      }
    }
    expect(actions.deauthenticate()).toEqual(expectedAction)
  })
})
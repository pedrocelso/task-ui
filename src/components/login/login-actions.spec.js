import * as actions from './login-actions'
import * as types from './login-types'

describe('login-actions', () => {
  it('.authenticate() - should create an action to authenticate', () => {
    const name = `test`
    const email = `test@test.com`
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`
    const expectedAction = {
      type: types.AUTHENTICATE,
      payload: {
        authenticated: true,
        token,
        name,
        email
      }
    }
    expect(actions.authenticate(token, name, email)).toEqual(expectedAction)
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

  it('.setName() - should create an action to setName', () => {
    const name = `test`
    const expectedAction = {
      type: types.SET_NAME,
      payload: {
        name
      }
    }
    expect(actions.setName(name)).toEqual(expectedAction)
  })

  it('.setEmail() - should create an action to setEmail', () => {
    const email = `test@test.com`
    const expectedAction = {
      type: types.SET_EMAIL,
      payload: {
        email
      }
    }
    expect(actions.setEmail(email)).toEqual(expectedAction)
  })
})
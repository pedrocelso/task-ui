import { loginReducer } from './login-reducers'
import * as types from './login-types'

const emptyState = {
  authenticated: false,
  token: ``
}

const baseState = {
  authenticated: true,
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`
}

describe('loginReducer', () => {
  it('should return the initial state', () => {
    expect(loginReducer(undefined, {})).toEqual(emptyState)
  })

  it('should handle AUTHENTICATE', () => {
    expect(
      loginReducer(emptyState, {
        type: types.AUTHENTICATE,
        payload: {
          authenticated: true,
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`
        }
      })
    ).toEqual(baseState)
  })

  it('should handle DEAUTHENTICATE', () => {
    expect(
      loginReducer(baseState, {
        type: types.DEAUTHENTICATE,
        payload: {
          authenticated: false          
        }
      })
    ).toEqual(emptyState)
  })
})
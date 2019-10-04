import * as actions from './editor-actions'
import * as types from './editor-types'

describe('editor-actions', () => {
  it('.open() - should open the editor', () => {
    const expectedAction = {
      type: types.OPEN,
      payload: {
        open: true
      }
    }
    expect(actions.open()).toEqual(expectedAction)
  })

  it('.deauthenticate() - should close the editor', () => {
    const expectedAction = {
      type: types.CLOSE,
      payload: {
        open: false
      }
    }
    expect(actions.close()).toEqual(expectedAction)
  })
})
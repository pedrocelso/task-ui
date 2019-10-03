import { editorReducer } from './editor-reducers'
import * as types from './editor-types'

const emptyState = {
  open: false
}

const baseState = {
  open: true
}

describe('editorReducer', () => {
  it('should return the initial state', () => {
    expect(editorReducer(undefined, {})).toEqual(emptyState)
  })

  it('should handle OPEN', () => {
    expect(
      editorReducer(emptyState, {
        type: types.OPEN,
        payload: {
          open: true
        }
      })
    ).toEqual(baseState)
  })

  it('should handle CLOSE', () => {
    expect(
      editorReducer(baseState, {
        type: types.CLOSE,
        payload: {
          open: false          
        }
      })
    ).toEqual(emptyState)
  })
})
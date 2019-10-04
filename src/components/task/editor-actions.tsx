import { OPEN, CLOSE, EditorActionTypes } from './editor-types' 

export function open(): EditorActionTypes {
  return {
    type: OPEN,
    payload: {
      open: true
    }
  }
}

export function close(): EditorActionTypes {
  return {
    type: CLOSE,
    payload: {
      open: false
    }
  }
}

import { OPEN, CLOSE, EditorActionTypes, EditorState } from './editor-types' 

const initialState: EditorState = {
  open: false,
}

export function editorReducer(
  state = initialState,
  action: EditorActionTypes
): EditorState {
  switch (action.type) {
    case OPEN:
      return {
        open: true
      }
    case CLOSE:
      return {
        open: false
      }
    default:
      return state
  }
}
export interface EditorState {
  open: boolean;
}

export const OPEN = 'OPEN'
export const CLOSE = 'CLOSE'

interface OpenAction {
  type: typeof OPEN
  payload: {
    open: boolean
  }
}

interface CloseAction {
  type: typeof CLOSE
  payload: {
    open: boolean
  }
}

export type EditorActionTypes = OpenAction | CloseAction
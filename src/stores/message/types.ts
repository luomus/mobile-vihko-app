export const SET_MESSAGE_STATE = 'SET_MESSAGE_STATE'
export const POP_MESSAGE_STATE = 'POP_MESSAGE_STATE'
export const CLEAR_MESSAGE_STATE = 'CLEAR_MESSAGE_STATE'

export interface MessageState {
  type: 'msg' | 'conf' | 'dangerConf' | 'err' | null,
  messageContent: string | null,
  okLabel?: string,
  cancelLabel?: string,
  onOk?: () => void,
  onCancel?: () => void,
}

interface setMessageState {
  type: typeof SET_MESSAGE_STATE,
  payload: MessageState,
}

interface popMessageState {
  type: typeof POP_MESSAGE_STATE,
}

interface clearMessageState {
  type: typeof CLEAR_MESSAGE_STATE,
}

export type messageActionTypes =
  setMessageState |
  popMessageState |
  clearMessageState
export const CLEAR_MESSAGE_STATE = 'CLEAR_MESSAGE_STATE'
export const POP_MESSAGE_STATE = 'POP_MESSAGE_STATE'
export const SET_MESSAGE_STATE = 'SET_MESSAGE_STATE'

export interface MessageType {
  type: 'msg' | 'conf' | 'redConf' | 'dangerConf' | 'err' | null,
  messageContent: string | null,
  okLabel?: string,
  cancelLabel?: string,
  onOk?: () => void,
  onCancel?: () => void,
  backdropOpacity?: number,
  testID?: string,
}

interface clearMessageState {
  type: typeof CLEAR_MESSAGE_STATE,
}

interface popMessageState {
  type: typeof POP_MESSAGE_STATE,
}

interface setMessageState {
  type: typeof SET_MESSAGE_STATE,
  payload: MessageType,
}

export type messageActionTypes =
  clearMessageState |
  popMessageState |
  setMessageState
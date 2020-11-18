import {
  messageActionTypes,
  MessageState,
  SET_MESSAGE_STATE,
  CLEAR_MESSAGE_STATE,
  POP_MESSAGE_STATE,
} from './types'

export const setMessageState = (newState: MessageState) : messageActionTypes => ({
  type: SET_MESSAGE_STATE,
  payload: newState
})

export const popMessageState = () : messageActionTypes => ({
  type: POP_MESSAGE_STATE,
})

export const clearMessageState = () : messageActionTypes => ({
  type: CLEAR_MESSAGE_STATE,
})
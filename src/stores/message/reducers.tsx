import {
  MessageType,
  messageActionTypes,
  CLEAR_MESSAGE_STATE,
  POP_MESSAGE_STATE,
  SET_MESSAGE_STATE
} from './types'

const initState: MessageType[] = []

export const messageReducer = (state: MessageType[] = initState, action: messageActionTypes) => {
  switch (action.type) {
    case CLEAR_MESSAGE_STATE:
      return initState
    case POP_MESSAGE_STATE:
      return state.splice(1)
    case SET_MESSAGE_STATE:
      return state.concat(action.payload)
    default:
      return state
  }
}
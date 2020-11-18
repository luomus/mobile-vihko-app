import {
  messageActionTypes,
  MessageState,
  SET_MESSAGE_STATE,
  POP_MESSAGE_STATE,
  CLEAR_MESSAGE_STATE
} from './types'

const initState: MessageState[] = []

export const messageReducer = (state: MessageState[] = initState, action: messageActionTypes) => {
  switch (action.type) {
    case SET_MESSAGE_STATE:
      return state.concat(action.payload)
    case POP_MESSAGE_STATE:
      return state.splice(1)
    case CLEAR_MESSAGE_STATE:
      return initState
    default:
      return state
  }
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessageType } from './types'

const initialState: MessageType[] = []

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessageState() {
      return initialState
    },
    popMessageState(state) {
      return state.splice(1)
    },
    setMessageState(state, action: PayloadAction<MessageType>) {
      return state.concat(action.payload)
    }
  }
})

export const { clearMessageState, popMessageState, setMessageState } = messageSlice.actions
export default messageSlice.reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CredentialsType } from './types'
import { getMetadata, getPermissions, initLocalCredentials, loginUser, logoutUser } from './actions'

const initialState: CredentialsType = {
  user: null,
  token: null
}

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    clearCredentials() {
      return initialState
    },
    setCredentials(state, action: PayloadAction<CredentialsType>) {
      state.user = action.payload.user
      state.token = action.payload.token
      if (action.payload.permissions) state.permissions = action.payload.permissions
      if (action.payload.metadata) state.metadata = action.payload.metadata
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, () => { })
      .addCase(loginUser.rejected, () => { })
      .addCase(initLocalCredentials.fulfilled, () => { })
      .addCase(initLocalCredentials.rejected, () => { })
      .addCase(getPermissions.fulfilled, () => { })
      .addCase(getPermissions.rejected, () => { })
      .addCase(getMetadata.fulfilled, () => { })
      .addCase(getMetadata.rejected, () => { })
      .addCase(logoutUser.fulfilled, () => { })
      .addCase(logoutUser.rejected, () => { })
  }
})

export const { clearCredentials, setCredentials } = credentialsSlice.actions
export default credentialsSlice.reducer
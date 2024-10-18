import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SchemaType } from './types'
import { initSchema, switchSchema } from './actions'

const initSchemaState: SchemaType = {
  fi: null,
  en: null,
  sv: null,
  formID: ''
}

const schemaSlice = createSlice({
  name: 'schema',
  initialState: initSchemaState,
  reducers: {
    setSchema(state, action: PayloadAction<SchemaType>) {
      if (action.payload.fi) state.fi = action.payload.fi
      if (action.payload.en) state.en = action.payload.en
      if (action.payload.sv) state.sv = action.payload.sv
      if (action.payload.formID) state.formID = action.payload.formID
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSchema.fulfilled, () => { })
      .addCase(initSchema.rejected, () => { })
      .addCase(switchSchema.fulfilled, () => { })
      .addCase(switchSchema.rejected, () => { })
  }
})

export const { setSchema } = schemaSlice.actions
export const schemaReducer = schemaSlice.reducer
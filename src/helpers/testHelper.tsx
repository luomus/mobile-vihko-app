import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { store } from '../stores'

export function renderWithProviders(
  ui: React.ReactElement
) {
  const Wrapper = ({ children }: PropsWithChildren): React.JSX.Element => (
    <Provider store={store}>{children}</Provider>
  )

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper })
  }
}
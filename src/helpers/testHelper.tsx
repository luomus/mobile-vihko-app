import React, { PropsWithChildren, ReactNode } from 'react'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { store } from '../stores'

export function renderWithProviders(
  ui: React.ReactElement
) {
  function Wrapper({ children }: PropsWithChildren<ReactNode | undefined>): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper }) }
}
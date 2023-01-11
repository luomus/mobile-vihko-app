import { fireEvent, waitFor, cleanup } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'
// import { useNetInfo } from '@react-native-community/netinfo'

describe('LoginComponent', () => {
  let container
  beforeEach(() => {
    container = renderWithProviders(<Navigator initialRoute='login'/>)
  })

  afterEach(cleanup)

  it('should display the login component correctly', async () => {
    // Check everything is displayed in Finnish
    await waitFor(() => expect(container.getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(container.getByText(fi['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('SV')) // Test switching language to Swedish

    // Check everything is displayed in Swedish
    expect(container.getAllByText(sv['mobile vihko'])).toBeDefined()
    expect(container.getByText(sv['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('EN'))

    // Check everything is displayed in English
    expect(container.getAllByText(en['mobile vihko'])).toBeDefined()
    expect(container.getByText(en['login text'])).toBeDefined()
    expect(container.getByText('FI')).toBeDefined()
    expect(container.getByText('SV')).toBeDefined()
    expect(container.getByText('EN')).toBeDefined()
    fireEvent.press(container.getByText('FI'))

    expect(container.getAllByText(fi['mobile vihko'])).toBeDefined()
  })

  it('should login correctly and show the trip form', async () => {
    await waitFor(() => expect(container.getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(container.getByText(fi['login text'])).toBeDefined()
    fireEvent.press(container.getByText(fi['login']))

    await waitFor(() => expect(container.getAllByText(fi['trip form'])).toHaveLength(3))
    fireEvent.press(container.getByText(fi['trip form']))
    fireEvent.press(container.getByText(fi['cancel']))
    await waitFor(() => expect(container.getByText(fi['trip form'])).toBeDefined())
  })

  it('should logout successfully', async () => {
    await waitFor(() => expect(container.getByText(fi['new observation event'])).toBeDefined())
    expect(container.getByText(fi['new observation event'])).toBeDefined()
    fireEvent.press(container.getByTestId('usermodal-visibility-button'))
    fireEvent.press(container.getByTestId('logout-button'))

    await waitFor(() => expect(container.getAllByText(fi['logout'])).toBeDefined())
    fireEvent.press(container.getAllByText(fi['exit'])[0])

    await waitFor(() => expect(container.getAllByText(fi['login text'])).toBeDefined())
  })

})


// eslint-disable-next-line jest/no-commented-out-tests
// describe('LoginComponent with network issues', () => {
//   let container
//   beforeEach(() => {
//     container = renderWithProviders(<Navigator initialRoute='login'/>)
//   })

// eslint-disable-next-line jest/no-commented-out-tests
//   it('should display no network error message', async () => {

//     await waitFor(() => expect(container.getAllByText(fi['mobile vihko'])).toBeDefined())


//     await waitFor(() => expect(container.getByText(fi['login text'])).toBeDefined())
//     await waitFor(() => expect(container.getByText(fi['login'])).toBeDefined())

//     await fireEvent.press(container.getByTestId('login-button'))


//     await waitFor(() => expect(container.getByText(fi['trip form'])).toBeDefined())
//     await useNetInfo.mockResolvedValueOnce({
//       type: 'test', // not 'unknown'
//       isInternetReachable: false,
//     })

//     fireEvent.press(container.getByText(fi['trip form']))

//     //For some reason the error modals aren't displayed
//     await waitFor(() => expect(container.getByText(fi['failed to check token'])).toBeDefined())
//   })
// })
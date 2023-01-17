import { fireEvent, waitFor, cleanup, TextMatch, TextMatchOptions } from '@testing-library/react-native'
import React from 'react'
import { renderWithProviders } from '../../../helpers/testHelper'
import Navigator from '../../../navigation/Navigator'
import * as en from '../../../languages/translations/en.json'
import * as fi from '../../../languages/translations/fi.json'
import * as sv from '../../../languages/translations/sv.json'
import { ReactTestInstance } from 'react-test-renderer'
// import { useNetInfo } from '@react-native-community/netinfo'

describe('LoginComponent', () => {
  let getByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance
  let getByTestId: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance
  let getAllByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance[]

  beforeEach(() => {
    ({ getByText, getByTestId, getAllByText } = renderWithProviders(<Navigator initialRoute='login'/>))
  })

  afterEach(cleanup)

  it('should display the login component correctly', async () => {
    // Check everything is displayed in Finnish
    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(getByText(fi['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('SV')) // Test switching language to Swedish

    // Check everything is displayed in Swedish
    expect(getAllByText(sv['mobile vihko'])).toBeDefined()
    expect(getByText(sv['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('EN'))

    // Check everything is displayed in English
    expect(getAllByText(en['mobile vihko'])).toBeDefined()
    expect(getByText(en['login text'])).toBeDefined()
    expect(getByText('FI')).toBeDefined()
    expect(getByText('SV')).toBeDefined()
    expect(getByText('EN')).toBeDefined()
    fireEvent.press(getByText('FI'))

    expect(getAllByText(fi['mobile vihko'])).toBeDefined()
  })

  it('should login correctly and show the trip form', async () => {
    await waitFor(() => expect(getAllByText(fi['mobile vihko'])).toBeDefined())
    expect(getByText(fi['login text'])).toBeDefined()
    fireEvent.press(getByText(fi['login']))

    await waitFor(() => expect(getAllByText(fi['trip form'])).toHaveLength(3))
    fireEvent.press(getByText(fi['trip form']))
    fireEvent.press(getByText(fi['cancel']))
    await waitFor(() => expect(getByText(fi['trip form'])).toBeDefined())
  })

  it('should logout successfully', async () => {
    await waitFor(() => expect(getByText(fi['new observation event'])).toBeDefined())
    expect(getByText(fi['new observation event'])).toBeDefined()
    fireEvent.press(getByTestId('usermodal-visibility-button'))
    fireEvent.press(getByTestId('logout-button'))

    await waitFor(() => expect(getAllByText(fi['logout'])).toBeDefined())
    fireEvent.press(getAllByText(fi['exit'])[0])

    await waitFor(() => expect(getAllByText(fi['login text'])).toBeDefined())
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
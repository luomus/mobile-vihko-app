import React from 'react'
import HomeScreen from '../screens/HomeScreen'

import renderer from 'react-test-renderer'

describe('<HomeScreen />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(<HomeScreen />).toJSON()
    expect(tree).toMatchSnapshot()
  })

})

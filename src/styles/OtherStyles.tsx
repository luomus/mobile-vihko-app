import { StyleSheet } from 'react-native'
import Colors from './Colors'

const OtherStyles = StyleSheet.create({
  textInput: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    height: 40,
    width: '100%',
    padding: 10
  },
  observationTextInput: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    textAlign: 'justify'
  },
  touchableHiglightStyle: {
    backgroundColor: Colors.primary5,
    borderRadius: 5
  },
  datePicker: {
    padding: 10,
    borderColor: Colors.neutral5,
    borderWidth: 1,
    height: 40,
    width: '90%',
  },
  hiddenComponent: {
    height: 0,
  }
})

export default OtherStyles
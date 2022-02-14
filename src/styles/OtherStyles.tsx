import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'

const OtherStyles = StyleSheet.create({
  coordinateInput: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    height: 40,
    width: '25%',
    padding: 10
  },
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
  },
  mapViewStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  miniMapViewStyle: {
    width: '100%',
    height: 150
  },
  horizontalLine: {
    borderBottomColor: Colors.neutral5,
    borderBottomWidth: 2,
    paddingVertical: 5
  }
})

export default OtherStyles
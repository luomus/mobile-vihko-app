import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'

const OtherStyles = StyleSheet.create({
  coordinateInput: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: '100%',
    padding: 10
  },
  textInput: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    minHeight: 40,
    width: '100%',
    padding: 10,
    textAlignVertical: 'center'
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
  gridModalMapViewStyle: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  miniMapViewStyle: {
    width: '100%',
    height: 150
  },
  horizontalLine: {
    borderBottomColor: Colors.neutral5,
    borderBottomWidth: 2,
    paddingVertical: 5
  },
  iOSPickerInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  iOSListSorter: {
    color: Colors.neutral6,
    fontSize: 24,
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 15
  }
})

export default OtherStyles
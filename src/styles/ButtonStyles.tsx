import { StyleSheet } from 'react-native'
import Colors from './Colors'

const ButtonStyles = StyleSheet.create({
  headerButton: {
    padding: 10,
    color: Colors.white,
  },
  homeButton: {
    width: '20%',
    padding: 10,
  },
  loginButton: {
    width: '60%',
    padding: 10,
  },
  editEventButton: {
    width: 60,
    backgroundColor: Colors.neutralButton
  },
  sendEventButton: {
    width: 60,
    backgroundColor: Colors.positiveButton
  },
  removeEventButton: {
    width: 60,
    backgroundColor: Colors.negativeButton
  },
  addImageButton: {
    width: 190,
    backgroundColor: Colors.neutralButton,
  },
  removeImageButton: {
    width: 30,
    height: 30,
  },
  logoutButton: {
    backgroundColor: Colors.negativeButton,
    width: '45%',
  },
  continueButton: {
    backgroundColor: Colors.neutralColor
  },
  endButton: {
    backgroundColor: Colors.negativeColor
  },
  observationButton: {
    backgroundColor: Colors.neutralColor
  },
  basicNegativeButton: {
    backgroundColor: Colors.negativeButton
  },
  basicNeutralButton: {
    backgroundColor: Colors.neutralButton
  },
  basicPositiveButton: {
    backgroundColor: Colors.positiveButton
  },
  mapModalPositiveButton: {
    backgroundColor: Colors.neutralColor,
    width: '45%',
    alignSelf: 'center',
    margin: 2
  },
  mapModalNegativeButton: {
    backgroundColor: Colors.negativeColor,
    width: '45%',
    alignSelf: 'center',
    margin: 2
  },
  refreshButton: {
    backgroundColor: Colors.neutralButton,
    marginLeft: 10
  },
  sendEventModalPositiveButton: {
    backgroundColor: Colors.positiveButton,
    width: '65%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  sendEventModalNeutralButton: {
    backgroundColor: Colors.privateColor,
    width: '65%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  sendEventModalNegativeButton: {
    backgroundColor: Colors.negativeButton,
    width: '65%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  }
})

export default ButtonStyles
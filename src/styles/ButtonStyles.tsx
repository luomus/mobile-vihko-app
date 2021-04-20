import { StyleSheet } from 'react-native'
import Colors from './Colors'

const ButtonStyles = StyleSheet.create({
  headerButton: {
    padding: 10,
    color: Colors.white,
    borderRadius: 5
  },
  homeButton: {
    width: '20%',
    padding: 10,
    borderRadius: 5
  },
  loginButton: {
    width: '60%',
    padding: 10,
    borderRadius: 5
  },
  loginCancelButton: {
    width: '60%',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center'
  },
  editEventButton: {
    width: 60,
    backgroundColor: Colors.neutralButton,
    borderRadius: 5
  },
  sendEventButton: {
    width: 60,
    backgroundColor: Colors.positiveButton,
    borderRadius: 5
  },
  removeEventButton: {
    width: 60,
    backgroundColor: Colors.negativeButton,
    borderRadius: 5
  },
  addImageButton: {
    width: 190,
    backgroundColor: Colors.neutralButton,
    borderRadius: 5
  },
  removeImageButton: {
    width: 30,
    height: 30,
    borderRadius: 5
  },
  logoutButton: {
    backgroundColor: Colors.negativeButton,
    width: '45%',
    borderRadius: 5
  },
  continueButton: {
    backgroundColor: Colors.neutralColor,
    borderRadius: 5
  },
  endButton: {
    backgroundColor: Colors.negativeColor,
    borderRadius: 5
  },
  observationButton: {
    backgroundColor: Colors.neutralColor,
    borderRadius: 5
  },
  observationNeighborsButton: {
    backgroundColor: Colors.neutralColor,
    justifyContent: 'flex-start',
    borderRadius: 5
  },
  basicNegativeButton: {
    backgroundColor: Colors.negativeButton,
    borderRadius: 5
  },
  basicNeutralButton: {
    backgroundColor: Colors.neutralButton,
    borderRadius: 5
  },
  basicPositiveButton: {
    backgroundColor: Colors.positiveButton,
    borderRadius: 5
  },
  mapModalPositiveButton: {
    backgroundColor: Colors.neutralColor,
    width: '45%',
    alignSelf: 'center',
    margin: 2,
    borderRadius: 5
  },
  mapModalNegativeButton: {
    backgroundColor: Colors.negativeColor,
    width: '45%',
    alignSelf: 'center',
    margin: 2,
    borderRadius: 5
  },
  refreshButton: {
    backgroundColor: Colors.neutralButton,
    marginLeft: 10,
    borderRadius: 5
  },
  sendEventModalPositiveButton: {
    backgroundColor: Colors.positiveButton,
    width: '75%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 5
  },
  sendEventModalNeutralButton: {
    backgroundColor: Colors.privateColor,
    width: '75%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 5
  },
  sendEventModalNegativeButton: {
    backgroundColor: Colors.negativeButton,
    width: '75%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 5
  },
  timestampButton: {
    backgroundColor: Colors.positiveButton,
    marginRight: 5,
    width: 130
  },
  chooseTimeButton: {
    backgroundColor: Colors.neutralButton,
    marginRight: 5,
    width: 130
  },
  neutralIconButton: {
    backgroundColor: Colors.neutralButton
  },
  negativeIconButton: {
    backgroundColor: Colors.negativeButton
  },
  stopObservingFromMapButton: {
    backgroundColor: Colors.negativeButton,
    padding: 2,
    width: 160,
    borderRadius: 5
  }
})

export default ButtonStyles
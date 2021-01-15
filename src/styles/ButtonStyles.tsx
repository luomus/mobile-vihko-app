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
  observationNeighborsButton: {
    backgroundColor: Colors.neutralColor,
    justifyContent: 'flex-start'
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
<<<<<<< HEAD
    width: '75%',
=======
    width: '65%',
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  sendEventModalNeutralButton: {
    backgroundColor: Colors.privateColor,
<<<<<<< HEAD
    width: '75%',
=======
    width: '65%',
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  sendEventModalNegativeButton: {
    backgroundColor: Colors.negativeButton,
<<<<<<< HEAD
    width: '75%',
=======
    width: '65%',
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 10
  }
})

export default ButtonStyles
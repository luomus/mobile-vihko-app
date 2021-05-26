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
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  loginCancelButton: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editEventButton: {
    padding: 5,
    borderRadius: 5
  },
  sendEventButton: {
    padding: 5,
    borderRadius: 5
  },
  removeEventButton: {
    padding: 5,
    borderRadius: 5
  },
  addImageButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  removeImageButton: {
    width: 30,
    height: 30,
    borderRadius: 5
  },
  logoutButton: {
    padding: 3,
    borderRadius: 5
  },
  continueButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  endButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  observationButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5
  },
  editObservationButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  observationNeighborsButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderRadius: 5
  },
  basicNeutralButton: {
    paddingBottom: 5,
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  basicPrimaryButton: {
    paddingBottom: 5,
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  beginButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    flexDirection: 'row'
  },
  mapModalButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    margin: 2,
    borderRadius: 5
  },
  refreshButton: {
    backgroundColor: Colors.neutralButton,
    marginLeft: 10,
    borderRadius: 5
  },
  sendEventModalPositiveButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5
  },
  sendEventModalNeutralButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5
  },
  sendEventModalNegativeButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5
  },
  timestampButton: {
    marginRight: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chooseTimeButton: {
    marginRight: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  neutralIconButton: {
    backgroundColor: Colors.neutralButton
  },
  negativeIconButton: {
    padding: 5,
    borderRadius: 5
  },
  addIconButton: {
    padding: 5,
    borderRadius: 5
  },
  mapIconButton: {
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  stopObservingFromMapButton: {
    paddingBottom: 2,
    alignItems: 'center',
    borderRadius: 5
  }
})

export default ButtonStyles
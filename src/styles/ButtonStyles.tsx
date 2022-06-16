import { StyleSheet } from 'react-native'
import Colors from './Colors'

const ButtonStyles = StyleSheet.create({

  //general
  iconButton: {
    padding: 5,
    borderRadius: 5
  },
  textAndIconButton: {
    paddingBottom: 5,
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeTextAndIconButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  sendEventModalButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5
  },

  //navigation bar
  headerButton: {
    padding: 10,
    color: Colors.whiteText,
    borderRadius: 5
  },
  headerUnavailableButton: {
    padding: 10,
    color: Colors.unavailableButton,
    borderRadius: 5
  },
  logoutButton: {
    padding: 3,
    borderRadius: 5
  },

  //login component
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

  //home component
  beginButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    flexDirection: 'row'
  },
  refreshButton: {
    borderRadius: 5
  },

  //map component
  observationButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
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
  mapModalButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5
  },
  mapIconButton: {
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  tileDetailsButton: {
    paddingTop: 2,
    paddingLeft: 5,
    borderRadius: 5,
    flexDirection: 'row'
  },
  stopObservingButton: {
    paddingBottom: 2,
    alignItems: 'center',
    borderRadius: 5,
  },

  //form components
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
  editObservationButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  timeButton: {
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
  }
})

export default ButtonStyles
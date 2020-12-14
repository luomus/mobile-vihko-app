import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'

const ContainerStyles = StyleSheet.create({
  homeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  infoContainer: {
    padding: '5%',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonContainer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  observationEventContainer: {
    width: '90%',
    backgroundColor: Colors.blueBackground
  },
  switchContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: '90%',
    borderColor: Colors.darkBlueInputBorder,
    borderWidth: 1,
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '45%'
  },
  inputContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  observationContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  userInfoContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  logoutButtonContainer: {
    alignItems: 'flex-end'
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithJustPadding: {
    padding: 10
  },
  formContainer: {
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('screen').width * 0.125
  },
  formInputContainer: {
    padding: 10,
    width: '100%'
  },
  formArrayInputContainer: {
    width: '100%'
  },
  formPickerContainer: {
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  formArrayButtonContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  formAllInputsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  formSaveButtonContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  singleObservationEventContainer: {
    padding: 10,
    justifyContent: 'space-between',
  },
  mapViewStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mapTypeContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    alignSelf: 'flex-end'
  },
  userLocationContainer: {
    position: 'absolute',
    top: '10%',
    right: '1%',
    alignSelf: 'flex-end'
  },
  observationTypeButtonsContainer: {
    position: 'absolute',
    width: '98%',
    bottom: '1%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  observationTypeButton: {
    padding: 5,
  },
  observationTypeButtonsColumn: {
    alignSelf: 'flex-end',
    justifyContent: 'space-between'
  },
  observationAddModal: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  loginViewContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  loginLanguageContainer: {
    paddingTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  observationListLine: {
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  observationPropertyTitle: {
    width: '40%',
  },
  observationPropertyValue: {
    width: '60%',
    paddingLeft: 10
  },
  observationInfoContainer: {
    padding: 5,
    backgroundColor: Colors.blueBackground,
    justifyContent: 'center',
  },
  editObservationButtonContainer: {
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  eventDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  eventTopContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15
  },
  eventTextContainer: {
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'center',
  },
  eventButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageElementRowContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
  imageElementColumnContainer: {
    padding: 5,
    justifyContent: 'space-between'
  },
  noImageContainer: {
    width: 150,
    height: 150,
    borderStyle: 'dashed',
    borderColor: Colors.noImageBorder,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageButtonsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonsColumnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding5Container: {
    padding: 5
  },
  observationInfoMapContainer: {
    width: '100%',
    height: 150
  },
  observationInfoImageContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  singleButton: {
    width: '50%',
    padding: 5
  },
  imagesContainer: {
    justifyContent: 'space-between'
  },
  singleImageContainer: {
    padding: 5
  },
  removeIconContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%'
  },
  beginButtonContainer: {
    padding: 5,
    width: '100%',
  },
  continueButtonContainer: {
    padding: 5,
    width: '50%'
  },
  endButtonContainer: {
    padding: 5,
    width: '50%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  floatingButton: {
    bottom: 0,
    position: 'absolute',
  },
  observationEventListContainer: {
    padding: 10,
    backgroundColor: Colors.blueBackground,
    width: '90%'
  },
  observationEventListItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    marginBottom: 5
  },
  homeInfoContainer: {
    padding: 10,
    width: '90%'
  },
  alignRightContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'stretch',
    right: '35%',
    padding: 6
  },
  gpsStatusBar: {
    padding: 5,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.headerBackground,
  },
  gpsBarLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  gpsBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2979ae'
  },
  versionContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  outerVersionContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
  }
})

export default ContainerStyles
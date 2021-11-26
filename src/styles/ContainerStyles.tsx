import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'

const ContainerStyles = StyleSheet.create({

  //general
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentAndVersionContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  inputContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  instructionContainer: {
    flexDirection: 'row',
    width: '95%'
  },
  messageModalContainer: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.neutral3
  },
  userModalContainer: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.neutral3
  },
  padding5Container: {
    padding: 5
  },
  padding10Container: {
    padding: 10
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.neutral2
  },

  //navigation bar
  languageContainer: {
    backgroundColor: Colors.primary5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40
  },

  //login component
  loginContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '45%'
  },
  loginButtonContainer: {
    marginTop: 25
  },
  loginLanguageContainer: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row'
  },

  //home component
  homeContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabContainer: {
    width: '100%'
  },
  homeUserContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  logoutButtonContainer: {
    alignItems: 'flex-end'
  },
  homeInfoContainer: {
    padding: 10,
    width: '90%'
  },
  eventLauncherContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  unsentEventsContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  continueEventContainer: {
    width: '90%',
    marginTop: 10
  },
  zoneEventLauncherContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  zonePickerContainer: {
    height: 40,
    width: 240,
    borderColor: Colors.neutral5,
    borderWidth: 1,
    marginTop: 5,
    marginLeft: 10
  },
  filterPickerContainer: {
    flex: 1,
    width: Dimensions.get('window').width * 0.95,
    maxHeight: Dimensions.get('window').height * 0.95,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
  },
  filterPickerOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unfinishedEventButtonsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  zonePickerButtonContainer: {
    padding: 10,
    alignSelf: 'flex-start'
  },
  eventsListContainer: {
    padding: 10,
    marginTop: 10,
    width: '90%'
  },
  eventsListItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5
  },
  eyeIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'stretch',
    right: '35%',
    padding: 6
  },
  versionContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },

  //map component
  stopObservingContainer: {
    padding: 5,
    backgroundColor: Colors.primary5,
    justifyContent: 'flex-start'
  },
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.neutral3,
    alignItems: 'center'
  },
  mapButtonsContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    alignSelf: 'flex-end',
    flexDirection: 'column'
  },
  observationButtonsBaseContainer: {
    position: 'absolute',
    width: '98%',
    bottom: '1%'
  },
  observationButtonColumnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  leftButtonColumnContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.neutral3,
    borderRadius: 5,
    width: '50%'
  },
  rightButtonColumnContainer: {
    alignSelf: 'flex-end'
  },
  mapModalContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.neutral3,
    width: '90%',
    maxHeight: '75%'
  },
  mapModalItemContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 5,
    width: '90%',
    margin: 5
  },

  //observation event component
  overviewBaseContainer: {
    padding: 10,
    flexDirection: 'column'
  },
  overviewContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15
  },
  overviewTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%'
  },
  overviewButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%'
  },
  observationInfoContainer: {
    padding: 5,
    backgroundColor: Colors.primary3,
    justifyContent: 'center'
  },
  observationListElementTextContainer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  observationListElementTitlesContainer: {
    width: '45%'
  },
  observationListElementValuesContainer: {
    width: '55%',
    paddingLeft: 10
  },
  observationListElementImageContainer: {
    flexDirection: 'row',
    padding: 5
  },
  observationListElementButtonsContainer: {
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5
  },

  //message component
  messageButtonsContainer: {
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5
  },

  //info page component
  infoContainer: {
    padding: '5%',
  },

  //form components
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  formContentContainer: {
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('screen').width * 0.125
  },
  formSaveButtonContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formInputContainer: {
    padding: 10,
    width: '100%'
  },
  formArrayInputListContainer: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  formArrayInputContainer: {
    width: '100%'
  },
  formArrayButtonContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  switchContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%'
  },
  formPickerContainer: {
    borderColor: Colors.neutral5,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  imagePickerRowContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
  imagePickerColumnContainer: {
    padding: 5,
    justifyContent: 'space-between'
  },
  imagePickerEmptyContainer: {
    width: 150,
    height: 150,
    borderStyle: 'dashed',
    borderColor: Colors.neutral5,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageButtonsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageButtonsColumnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagesContainer: {
    justifyContent: 'space-between'
  },
  imageContainer: {
    padding: 5,
    marginRight: 5
  },
  keywordImageContainer: {
    padding: 5,
    borderColor: 'grey',
    borderWidth: 1,
    marginRight: 5
  },
  deleteImageIconContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  floatingButtonContainer: {
    bottom: 0,
    position: 'absolute'
  }
})

export default ContainerStyles
import { Platform, StyleSheet } from 'react-native'
import Colors from './Colors'

const TextStyles = StyleSheet.create({

  //general
  buttonText: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 5
  },
  boldButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5
  },
  alignedRightText: {
    textAlign: 'right',
    alignSelf: 'stretch',
    padding: 10
  },
  mapToListButtonText: {
    padding: 5,
    fontSize: 15
  },

  //navigation bar
  headerTitle: {
    color: Colors.neutral2,
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  languageText: {
    padding: 8,
    color: Colors.neutral9
  },
  selectionButtonText: {
    padding: 5,
    alignSelf: 'center',
    fontSize: 15,
  },
  trackingText: {
    alignSelf: 'center',
    color: Colors.whiteText,
    fontSize: 15
  },
  zonePickerDescription: {
    color: Colors.neutral7,
    fontSize: 16,
    paddingLeft: 10,
    paddingBottom: 10
  },
  zonePickerLabel: {
    color: Colors.neutral9,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingBottom: 10
  },

  //login component
  loginHeader: {
    fontSize: 25,
  },
  loginText: {
    textAlign: 'center',
    padding: 10
  },
  loginLanguage: {
    padding: 10
  },

  //home component
  formLauncherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 15
  },
  formLauncherText: {
    fontSize: 16,
    paddingBottom: 10,
    paddingHorizontal: 15
  },
  homeScreenTitle: {
    color: Colors.neutral9,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  previousObservationsTitle: {
    alignSelf: 'flex-start',
    color: Colors.neutral9,
    fontSize: 16,
    padding: 10,
    paddingLeft: 25
  },
  observationEventListElement: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: 10,
    alignItems: 'flex-start',
    width: '100%'
  },
  eventListElementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingHorizontal: 15
  },
  eventListElementThinTitle: {
    fontSize: 16,
    paddingTop: 12,
    paddingHorizontal: 15
  },
  eventListElementTextClear: {
    color: Colors.neutral9,
    fontSize: 16,
    paddingHorizontal: 15
  },
  eventListElementTextFaded: {
    color: Colors.neutral7,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingBottom: 10
  },
  unfinishedEventTextClear: {
    color: Colors.neutral9,
    fontSize: 16,
    paddingLeft: 10
  },
  unfinishedEventTextFaded: {
    color: Colors.neutral7,
    fontSize: 16,
    paddingLeft: 10
  },
  zoneListText: {
    fontSize: 18
  },

  //map component
  centeredBold: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  mapButtonsLeftTitle: {
    fontSize: 16,
    padding: 6,
    fontWeight: '500'
  },

  //overview component
  overviewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingVertical: 5
  },
  boldText: {
    fontWeight: 'bold'
  },

  //list component
  listText: {
    flex: 1,
    fontSize: 24
  },
  listBoldText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 24
  },
  listCountText: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingLeft: 20,
    paddingRight: 10
  },

  //form components
  noImageText: {
    color: Colors.neutral5
  },
  redText: {
    color: 'red'
  },
  redTextWithPadding: {
    color: 'red',
    paddingLeft: 10
  },
})

export default TextStyles
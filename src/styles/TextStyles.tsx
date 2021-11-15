import { StyleSheet } from 'react-native'
import Colors from './Colors'

const TextStyles = StyleSheet.create({
  headerTitle: {
    color: Colors.neutral2,
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  buttonText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 5
  },
  infoText: {
    fontSize: 18
  },
  speciesText: {
    fontWeight: 'bold',
    padding: 10
  },
  languageText: {
    padding: 8,
    color: Colors.darkText
  },
  loginHeader: {
    fontSize: 25,
  },
  loginText: {
    textAlign: 'center',
    padding: 10
  },
  errorText: {
    color: Colors.dangerButton2
  },
  observationText: {
    fontWeight: 'bold'
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
  loginLanguage: {
    padding: 10
  },
  boldText: {
    fontWeight: 'bold'
  },
  noImageText: {
    color: Colors.neutral5
  },
  alignedRightText: {
    textAlign: 'right',
    alignSelf: 'stretch',
    padding: 10
  },
  linkToLajiText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  centeredBold: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  mapButtonsLeftTitle: {
    fontSize: 16,
    padding: 6
  },
  fontSizeFifteen: {
    fontSize: 15
  },
  formLauncherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 25
  },
  formLauncherText: {
    fontSize: 16,
    paddingBottom: 25,
    paddingHorizontal: 25
  },
  eventListElementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingHorizontal: 25
  },
  eventListElementTextClear: {
    color: Colors.neutral9,
    fontSize: 16,
    paddingHorizontal: 25
  },
  eventListElementTextFaded: {
    color: Colors.neutral7,
    fontSize: 16,
    paddingHorizontal: 25,
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
  zonePickerDescription: {
    color: Colors.neutral7,
    fontSize: 16,
    paddingLeft: 10,
    paddingBottom: 10
  }
})

export default TextStyles
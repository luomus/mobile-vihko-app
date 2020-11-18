import { StyleSheet } from 'react-native'
import Colors from './Colors'

const TextStyles = StyleSheet.create({
  infoText: {
    fontSize: 18
  },
  speciesText: {
    fontWeight: 'bold',
    padding: 10
  },
  languageText: {
    padding: 10,
    color: Colors.white
  },
  loginHeader: {
    fontSize: 25,
  },
  loginText: {
    textAlign: 'center',
    padding: 10
  },
  errorText: {
    color: Colors.negativeColor
  },
  observationText: {
    fontWeight: 'bold'
  },
  previousObservationsTitle: {
    fontWeight: 'bold',
  },
  observationEventTitle: {
    padding: 10,
    fontWeight: 'bold'
  },
  observationEventListElement: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: 6,
    alignItems: 'flex-start',
    position: 'relative',
    left: 0
  },
  loginLanguage: {
    padding: 10
  },
  boldText: {
    fontWeight: 'bold'
  },
  indentedText: {
    paddingLeft: 10
  },
  noImageText: {
    color: Colors.noImageBorder
  },
  alignedRightText: {
    textAlign: 'right',
    alignSelf: 'stretch',
    padding: 10
  },
  linkToLajiText: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})

export default TextStyles
import tripFormFi from '../../schemas/tripFormFi.json'
import tripFormSv from '../../schemas/tripFormSv.json'
import tripFormEn from '../../schemas/tripFormEn.json'
import birdAtlasFi from '../../schemas/birdAtlasFi.json'
import birdAtlasSv from '../../schemas/birdAtlasSv.json'
import birdAtlasEn from '../../schemas/birdAtlasEn.json'
import fungiAtlasFi from '../../schemas/fungiAtlasFi.json'
import fungiAtlasSv from '../../schemas/fungiAtlasSv.json'
import fungiAtlasEn from '../../schemas/fungiAtlasEn.json'
import lolifeFi from '../../schemas/lolifeFi.json'
import lolifeSv from '../../schemas/lolifeSv.json'
import lolifeEn from '../../schemas/lolifeEn.json'
import { CredentialsType } from '../../stores'

export const getSchemas = async (language: string, formId: string) => {
  if (language === 'fi' && formId === 'JX.519') {
    return tripFormFi.data.form
  } else if (language === 'sv' && formId === 'JX.519') {
    return tripFormSv.data.form
  } else if (language === 'en' && formId === 'JX.519') {
    return tripFormEn.data.form
  } else if (language === 'fi' && formId === 'MHL.117') {
    return birdAtlasFi.data.form
  } else if (language === 'sv' && formId === 'MHL.117') {
    return birdAtlasSv.data.form
  } else if (language === 'en' && formId === 'MHL.117') {
    return birdAtlasEn.data.form
  } else if (language === 'fi' && formId === 'JX.652') {
    return fungiAtlasFi.data.form
  } else if (language === 'sv' && formId === 'JX.652') {
    return fungiAtlasSv.data.form
  } else if (language === 'en' && formId === 'JX.652') {
    return fungiAtlasEn.data.form
  } else if (language === 'fi' && formId === 'MHL.45') {
    return lolifeFi.data.form
  } else if (language === 'sv' && formId === 'MHL.45') {
    return lolifeSv.data.form
  } else if (language === 'en' && formId === 'MHL.45') {
    return lolifeEn.data.form
  }
}

export const postObservationEvent = async (observationEvent: Record<string, any>, credentials: CredentialsType) => {

  const unit = observationEvent.gatherings[0].units[0]

  if (
    observationEvent.formID !== 'JX.519' ||
    observationEvent.editors[0] !== 'MA.1' ||
    unit.identifications[0].taxon !== 'varis' ||
    unit.count !== '1' ||
    observationEvent.locality !== 'Etu-Töölö'
  ) {
    Promise.reject()
  }

  Promise.resolve()
}
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

export const getSchemas = async (language: string, formId: string) => {
  if (language === 'fi' && formId === 'JX.519') {
    return tripFormFi
  } else if (language === 'sv' && formId === 'JX.519') {
    return tripFormSv
  } else if (language === 'en' && formId === 'JX.519') {
    return tripFormEn
  } else if (language === 'fi' && formId === 'MHL.117') {
    return birdAtlasFi
  } else if (language === 'sv' && formId === 'MHL.117') {
    return birdAtlasSv
  } else if (language === 'en' && formId === 'MHL.117') {
    return birdAtlasEn
  } else if (language === 'fi' && formId === 'JX.652') {
    return fungiAtlasFi
  } else if (language === 'sv' && formId === 'JX.652') {
    return fungiAtlasSv
  } else if (language === 'en' && formId === 'JX.652') {
    return fungiAtlasEn
  } else if (language === 'fi' && formId === 'MHL.45') {
    return lolifeFi
  } else if (language === 'sv' && formId === 'MHL.45') {
    return lolifeSv
  } else if (language === 'en' && formId === 'MHL.45') {
    return lolifeEn
  }
}
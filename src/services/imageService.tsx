import axios from 'axios'
import i18n from '../languages/i18n'
import * as FileSystem from 'expo-file-system'
import { postImageUrl } from '../config/urls'
import { accessToken } from '../config/keys'
import { CredentialsType } from '../stores'
import { getProfile } from './userService'

const JPEG_EXTENSIONS = ['jpeg', 'jpg']
const TIFF_EXTENSIONS = ['tiff', 'tif']
const SNGL_EXTENSIONS = ['bmp', 'gif', 'png']
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif']
const MAX_FILE_SIZE = 20000000

interface BasicObject {
  [key: string]: any
}

const processImage = async (uri: string) => {
  const { size } = await FileSystem.getInfoAsync(uri, { size: true })
  let name = uri.substring(uri.lastIndexOf('/') + 1)
  let type = uri.substring(uri.lastIndexOf('.') + 1)

  if (SNGL_EXTENSIONS.some((ext) => ext === type)) {
    type = `image/${type}`
  } else if (JPEG_EXTENSIONS.some((ext) => ext === type)) {
    type = 'image/jpeg'
  } else if (TIFF_EXTENSIONS.some((ext) => ext === type)) {
    type = 'image/tiff'
  }

  const image: BasicObject = {
    uri,
    name,
    size,
    type,
  }

  return image
}

const processImages = async (uris: string[]) => {
  return Promise.all(uris.map(async (uri) => {
    let image = null

    try {
      image = await processImage(uri)
    } catch (error) {
      return Promise.reject()
    }

    return Promise.resolve(image)
  }))
}

const getAllowedMediaFormatsAsString = () => {
  let formats = ''

  for (let i = 0; i < ALLOWED_FILE_TYPES.length; i++) {
    formats += ALLOWED_FILE_TYPES[i].split('/')[1]
    if (i < ALLOWED_FILE_TYPES.length - 2) {
      formats += ', '
    } else if (i === ALLOWED_FILE_TYPES.length - 2) {
      formats += ' ja '
    }
  }

  return formats
}

const getMaxFileSizeAsString = () => {
  let maxSize = MAX_FILE_SIZE.toString().substring(0, MAX_FILE_SIZE.toString().length - 6)
  return maxSize + ' Mt'
}

export const saveMedias = async (images: any, credentials: CredentialsType) => {
  let imageFiles = null
  const params = {
    'personToken': credentials.token,
    'access_token': accessToken
  }
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json'
  }

  let uris: string[] = []
  let keywords: string[] = []

  if (typeof images?.[0] === 'object') {
    uris = images.map((image: Record<string, any>) => image.uri)
    keywords = images.map((image: Record<string, any>) => image.keywords)
  } else {
    uris = images
  }

  try {
    imageFiles = await processImages(uris)
  } catch (error) {
    throw new Error('error processing images before sending')
  }

  let invalidFile = (images.length <= 0)
  let fileTooLarge = false

  const formDataBody = new FormData()

  imageFiles.forEach(image => {
    if (!ALLOWED_FILE_TYPES.includes(image.type)) {
      invalidFile = true
    } else if (image.size > MAX_FILE_SIZE) {
      fileTooLarge = true
    } else {
      formDataBody.append('data', image)
    }
  })

  let res = null

  if (invalidFile) {
    throw new Error(`${i18n.t('incorrect format')} ${getAllowedMediaFormatsAsString()}.`)
  } else if (fileTooLarge) {
    throw new Error(`${i18n.t('oversized image')} ${getMaxFileSizeAsString()}.`)
  } else {
    try {
      res = await axios.post(postImageUrl, formDataBody, { params })
    } catch (error) {
      throw new Error(`${i18n.t('image post failure')} ${'status code'}${error.response.status}.`)
    }
  }

  //fetch profile from API and get the default media metadata from there
  const profile = await getProfile(credentials.token)
  let fetchedMetadata = profile.settings ? profile.settings.defaultMediaMetadata : undefined

  //if there isn't default media metadata, use "all rights reserved":
  const defaultMetadata = {
    'capturerVerbatim': fetchedMetadata?.capturerVerbatim ? [fetchedMetadata.capturerVerbatim] : [credentials.user?.fullName], //has to be array
    'intellectualOwner': fetchedMetadata?.intellectualOwner ? fetchedMetadata.intellectualOwner : credentials.user?.fullName,
    'intellectualRights': fetchedMetadata?.intellectualRights ? fetchedMetadata.intellectualRights : 'MZ.intellectualRightsARR'
  }

  //for each tempid in response send metadata and store the received permanent ID
  try {
    const idArr: string[] = await Promise.all(res.data.map(async (tempImage: BasicObject, index: number) => {
      const tempId = tempImage.id
      const keyword: string = keywords[index]
      let metadata
      if (keywords) {
        metadata = {
          ...defaultMetadata,
          keyword: [
            keyword
          ]
        }
      } else {
        metadata = defaultMetadata
      }

      try {
        res = await axios.post(
          postImageUrl + '/' + tempId,
          JSON.stringify(metadata),
          {
            params,
            headers
          }
        )
      } catch (error) {
        return Promise.reject(error)
      }

      return Promise.resolve(res.data.id)
    }))

    return idArr
  } catch (error) {
    throw new Error(`${i18n.t('metadata post failure')} ${'status code'}${error.response.status}.`)
  }
}
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { decode } from 'base-64'
import i18n from 'i18next'
import { CredentialsType } from '../stores'
import { sendImages, sendMetadata } from '../services/imageService'
import { log } from '../helpers/logger'
import { captureException } from './sentry'

const JPEG_EXTENSIONS = ['jpeg', 'jpg']
const TIFF_EXTENSIONS = ['tiff', 'tif']
const SNGL_EXTENSIONS = ['bmp', 'gif', 'png']
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif']
const MAX_FILE_SIZE = 20000000

interface BasicObject {
  [key: string]: any
}

const processImage = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri, { size: true })
  const size = fileInfo.exists ? fileInfo.size : 0
  const name = uri.substring(uri.lastIndexOf('/') + 1)
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

export const processImages = async (uris: string[]) => {
  return Promise.all(uris.map(async (uri) => {
    let image = null

    try {
      image = await processImage(uri)
    } catch (error) {
      captureException(error)
      return Promise.reject(error)
    }

    return Promise.resolve(image)
  }))
}

export const getAllowedMediaFormatsAsString = () => {
  let formats = ''

  for (let i = 0; i < ALLOWED_FILE_TYPES.length; i++) {
    formats += ALLOWED_FILE_TYPES[i].split('/')[1]
    if (i < ALLOWED_FILE_TYPES.length - 2) {
      formats += ', '
    } else if (i === ALLOWED_FILE_TYPES.length - 2) {
      formats += ' and '
    }
  }

  return formats
}

export const getMaxFileSizeAsString = () => {
  const maxSize = MAX_FILE_SIZE.toString().substring(0, MAX_FILE_SIZE.toString().length - 6)
  return maxSize + ' Mt'
}

export const isValidFileType = (type: string) => {
  return ALLOWED_FILE_TYPES.includes(type)
}

export const isValidFileSize = (size: number) => {
  return size <= MAX_FILE_SIZE
}

export const saveImages = async (images: Array<any>, credentials: CredentialsType) => {

  if (!credentials.token) {
    return
  }

  let imageFiles = null

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
    captureException(error)
    log.error({
      location: '/helpers/imageHelper.tsx saveImages()/processImages()',
      error: error,
      user_id: credentials.user?.id
    })
    throw new Error(i18n.t('error processing images before sending'))
  }

  if (typeof images?.[0] === 'object') {
    for (let i = 0; i < imageFiles.length; i++) {
      imageFiles[i] = { ...imageFiles[i], fromGallery: images[i].fromGallery }
    }
  }

  let invalidFile = (images.length <= 0)
  const invalidFileTypes: string[] = []
  let fileTooLarge = false

  const formDataBody = new FormData()

  await Promise.all(imageFiles.map(async image => {
    if (!isValidFileType(image.type)) {
      if (!invalidFileTypes.includes(image.type)) {
        invalidFileTypes.push(image.type)
      }

      invalidFile = true

      if (!image.fromGallery) {
        await MediaLibrary.saveToLibraryAsync(image.uri)
      }
    } else if (!isValidFileSize(image.size)) {

      fileTooLarge = true

      if (!image.fromGallery) {
        await MediaLibrary.saveToLibraryAsync(image.uri)
      }
    } else {
      // console.log('uri', image.uri)
      // let fetchedImage = await fetch(image.uri)
      // let blob = await fetchedImage.blob()
      // console.log('blob ', blob)

      let base64String = ''

      try {
        base64String = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' })
        console.log('A')
      } catch (error: any) {
        console.log('CATCH!')
        return Promise.reject({
          severity: 'low',
          message: 'Failed to read image.' 
        })
      }

      const binaryData = decode(base64String)
      console.log('B')

      //create a Uint8Array to represent the binary data
      const buffer = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        buffer[i] = binaryData.charCodeAt(i)
      }
      console.log('C')
      //create a File object from the binary data
      const file = new File([binaryData], image.name, { type: image.type })
      console.log('D', JSON.stringify(file, null, 4))
      // const imageFile = new File([imageContent], 'data')

      formDataBody.append('data', file)
    }
  }))

  let res = null

  if (invalidFile) {
    log.error({
      location: '/helpers/imageHelper.tsx saveImages()',
      error: {
        types: invalidFileTypes,
        message: 'Invalid file types',
        user_id: credentials.user?.id
      }
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('incorrect format')} ${getAllowedMediaFormatsAsString()}.`
    })
  } else if (fileTooLarge) {
    log.error({
      location: '/helpers/imageHelper.tsx saveImages()',
      error: {
        message: 'Too large files.',
        user_id: credentials.user?.id
      }
    })
    return Promise.reject({
      severity: 'low',
      message: `${i18n.t('oversized image')} ${getMaxFileSizeAsString()}.`
    })
  } else {
    try {
      // console.log('E', JSON.stringify(formDataBody, null, 4))
      res = await sendImages(formDataBody, credentials.token)
      // console.log('F', res)
    } catch (error: any) {
      // console.log('G', error)
      captureException(error)
      log.error({
        location: '/helpers/imageHelper.tsx saveImages()/sendImages()',
        error: error,
        user_id: credentials.user?.id
      })
      throw new Error(`${i18n.t('image post failure')} ${error.message}`)
    }
  }

  //if there isn't default media metadata, use "all rights reserved":
  const defaultMetadata = {
    'capturerVerbatim': credentials.metadata?.capturerVerbatim ? [credentials.metadata.capturerVerbatim] : [credentials.user?.fullName], //has to be array
    'intellectualOwner': credentials.metadata?.intellectualOwner ? credentials.metadata.intellectualOwner : credentials.user?.fullName,
    'intellectualRights': credentials.metadata?.intellectualRights ? credentials.metadata.intellectualRights : 'MZ.intellectualRightsARR'
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

      if (!credentials.token) {
        throw new Error('No credentials.')
      }

      try {
        res = await sendMetadata(tempId, metadata, credentials.token)
      } catch (error) {
        captureException(error)
        return Promise.reject(error)
      }

      return Promise.resolve(res.data.id)
    }))

    return idArr
  } catch (error: any) {
    captureException(error)
    log.error({
      location: '/helpers/imageHelper.tsx saveImages()/sendMetadata()',
      error: error,
      user_id: credentials.user?.id
    })

    throw new Error(`${i18n.t('metadata post failure')}  ${error.message}`)
  }
}
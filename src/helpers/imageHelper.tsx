import { Directory, File, Paths } from 'expo-file-system'
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
  const file = new File(uri)
  const fileInfo = file.info()
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

    } else if (!isValidFileSize(image.size)) {

      fileTooLarge = true

    } else {
      // @ts-ignore
      formDataBody.append('data', image)
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
      res = await sendImages(formDataBody, credentials.token)
    } catch (error: any) {
      captureException(error)
      log.error({
        location: '/helpers/imageHelper.tsx saveImages()/sendImages()',
        error: error,
        user_id: credentials.user?.id
      })
      return Promise.reject({
        severity: 'high',
        message: `${i18n.t('image post failure')} ${error.message}`
      })
    }

    try {
      await deleteImagesByCondition(filePath => uris.includes(filePath))
    } catch (error: any) {
      return Promise.reject({
        severity: 'low',
        message: `${i18n.t('failed to delete unused images')} ${error.message}`
      })
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

    throw new Error(`${i18n.t('metadata post failure')} ${error.message}`)
  }
}

const deleteImagesByCondition = async (
  condition: (filePath: string) => boolean
) => {
  const imageDir = new Directory(Paths.cache, 'ImagePicker')
  let allFilePaths: string[] = []

  try {
    const files = imageDir.list()
    allFilePaths = files.map(file => file.uri)
  } catch (error: any) {
    // if directory is missing, nothing to delete -> return silently
    const msg = (error && (error.message || '')).toString().toLowerCase()
    if (msg.includes('no such file') || msg.includes('not found')) {
      return
    }

    captureException(error)
    log.error({
      location: '/helpers/imageHelper.tsx saveImages()/deleteImagesByCondition()',
      error: error
    })
    throw new Error(`${i18n.t('error deleting unused images')} ${error}`)
  }

  await Promise.all(
    allFilePaths
      .filter(condition)
      .map(async (filePath) => {
        try {
          const deleteFile = new File(filePath)
          deleteFile.delete()
        } catch (error) {
          captureException(error)
          log.error({
            location: '/helpers/imageHelper.tsx saveImages()/deleteImagesByCondition()',
            error: error
          })
          throw new Error(`${i18n.t('error deleting unused images')} ${error}`)
        }
      })
  )
}

export const deleteAllUnusedImages = async (events: Record<string, any> | null) => {
  const imageDir = new Directory(Paths.cache, 'ImagePicker')
  const usedFilePaths: string[] = []

  if (!events || events.length === 0) {
    return
  }

  events.forEach((event: Record<string, any>) => {
    event.gatherings[0].units.forEach((unit: Record<string, any>) => {
      if (unit.images?.length > 0) {
        unit.images.forEach((image: Record<string, any>) => {
          if (image.uri.includes(imageDir.uri)) {
            usedFilePaths.push(image.uri)
          }
        })
      }
    })
  })

  try {
    await deleteImagesByCondition(filePath => !usedFilePaths.includes(filePath))
  } catch (error: any) {
    return Promise.reject({
      severity: 'low',
      message: error.message
    })
  }
}

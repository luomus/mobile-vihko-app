import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { RootState, DispatchType, setMessageState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import * as ImagePicker from 'expo-image-picker'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'
import { log } from '../../helpers/logger'
import { ErrorMessage } from '@hookform/error-message'
import { captureException } from '../../helpers/sentry'

type Props = {
  title: string,
  objectTitle: string,
  defaultValue: Array<Record<string, any>>
}

const ImagePickerComponent = (props: Props) => {
  const { register, setValue, setError, clearErrors, formState } = useFormContext()
  const [images, setImages] = useState<Array<Record<string, any>>>(Array.isArray(props.defaultValue) ? props.defaultValue : [])
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()

  const credentials = useSelector((state: RootState) => state.credentials)

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, images)
  }, [])

  const attachImage = async (useCamera: boolean) => {
    try {
      setLoading(true)

      let permissionResult: ImagePicker.CameraPermissionResponse | ImagePicker.MediaLibraryPermissionResponse

      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if (permissionResult.granted === false) {
          return false
        }
      }

      let pickerResult: ImagePicker.ImagePickerResult
      let fromGallery = false

      if (useCamera) {
        pickerResult = await ImagePicker.launchCameraAsync()
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync()
        fromGallery = true
      }

      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri

        setImages(images.concat({
          uri: uri,
          fromGallery: fromGallery
        }))
        setValue(props.objectTitle, images.concat({
          uri: uri,
          fromGallery: fromGallery
        }))
      }

      return !pickerResult.canceled
    } catch (error) {
      captureException(error)
      setError(props.objectTitle, { message: t('image attachment failure'), type: 'manual' })
      log.error({
        location: '/components/formComponents/FormImagePickerComponent attachImage()',
        error: error,
        user_id: credentials.user?.id
      })
      setTimeout(() => {
        clearErrors(props.objectTitle)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const imageFromLibrary = async () => {
    return attachImage(false)
  }

  const imageFromCamera = async () => {
    return attachImage(true)
  }

  const removeImage = (uri: string) => {
    const updatedImages = images.filter(i => i.uri !== uri)
    setImages(updatedImages)
    setValue(props.objectTitle, updatedImages)
  }

  const showRemoveImage = (uri: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('delete image?'),
      okLabel: t('delete'),
      cancelLabel: t('cancel'),
      onOk: () => removeImage(uri)
    }))
  }

  const errorMessageTranslation = (errorMessage: string): React.JSX.Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={Ts.redText}>{errorTranslation}</Text>
  }

  const renderImages = () => {
    return images.map((image: Record<string, any>) =>
      <View key={image.uri} style={Cs.imageContainer}>
        <ImageBackground
          source={{ uri: image.uri }}
          style={{ width: 150, height: 150 }}
        >
          <View style={Cs.deleteImageIconContainer}>
            <Icon
              name='delete'
              type='material-icons'
              color={'red'}
              size={22}
              onPress={() => { showRemoveImage(image.uri) }}
            />
          </View>
        </ImageBackground>
      </View>
    )
  }

  //if there are less than two images, render buttons next to image
  if (images.length < 2) {
    return (
      <>
        <ErrorMessage
          errors={formState.errors}
          name={props.objectTitle}
          render={({ message }) => <Text style={Ts.redText}><>{errorMessageTranslation(message)}</></Text>}
        />
        <View style={{ paddingLeft: 10 }}>
          <Text>{props.title}</Text>
        </View>
        <View
          style={Cs.imagePickerRowContainer}
        >
          {images.length === 0 ?
            <View style={Cs.imagePickerEmptyContainer}>
              <Text style={Ts.noImageText}>{t('no image')}</Text>
            </View>
            : renderImages()
          }
          <View style={Cs.imageButtonsColumnContainer}>
            <ButtonComponent onPressFunction={imageFromLibrary}
              title={t('choose image')} height={40} width={140} buttonStyle={Bs.addImageButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'photo-library'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
            <ButtonComponent onPressFunction={imageFromCamera}
              title={t('use camera')} height={40} width={140} buttonStyle={Bs.addImageButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'add-a-photo'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
        </View>
      </>
    )
  } else {
    return (
      <>
        <ErrorMessage
          errors={formState.errors}
          name={props.objectTitle}
          render={({ message }) => <Text style={Ts.redText}><>{errorMessageTranslation(message)}</></Text>}
        />
        <View style={{ paddingLeft: 10 }}>
          <Text>{props.title}</Text>
        </View>
        <View
          style={Cs.imagePickerColumnContainer}
        >
          <View style={{ paddingLeft: 10 }}>
            <Text>{props.title}</Text>
          </View>
          <View style={Cs.imagesContainer}>
            <ScrollView horizontal={true}>
              {renderImages()}
            </ScrollView>
            {loading ?
              <ActivityIndicator size={25} color={Colors.primary5} />
              :
              <View style={Cs.imageButtonsRowContainer}>
                <ButtonComponent onPressFunction={imageFromLibrary}
                  title={t('choose image')} height={40} width={140} buttonStyle={Bs.addImageButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'photo-library'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
                <ButtonComponent onPressFunction={imageFromCamera}
                  title={t('use camera')} height={40} width={140} buttonStyle={Bs.addImageButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'add-a-photo'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              </View>
            }
          </View>
        </View>
      </>
    )
  }
}

export default ImagePickerComponent
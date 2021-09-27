import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, ImageBackground, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { DispatchType, setMessageState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import * as ImagePicker from 'expo-image-picker'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'
import { log } from '../../helpers/logger'
import { ErrorMessage } from '@hookform/error-message'

type Props = {
  title: string,
  objectTitle: string,
  defaultValue: Array<string>
}

const ImagePickerComponent = (props: Props) => {
  const { register, setValue, setError, formState } = useFormContext()
  const [images, setImages] = useState<Array<string>>(Array.isArray(props.defaultValue) ? props.defaultValue : [])
  const { t } = useTranslation()

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, images)
  }, [])

  const attachImage = async (useCamera: boolean) => {
    try {
      let permissionResult: ImagePicker.CameraPermissionResponse | ImagePicker.MediaLibraryPermissionResponse

      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      }
      if (permissionResult.granted === false) {
        return false
      }

      let pickerResult: ImagePicker.ImagePickerResult

      if (useCamera) {
        pickerResult = await ImagePicker.launchCameraAsync()
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync()
      }

      if (!pickerResult.cancelled) {
        let uri = pickerResult.uri

        setImages(images.concat(uri))
        setValue(props.objectTitle, images.concat(uri))
      }

      return !pickerResult.cancelled
    } catch (error) {
      setError(props.objectTitle, { message: 'Error while attaching image', type: 'manual' })
      log.error({
        location: '/components/formComponents/FormImagePickerComponent attachImage()',
        error: error
      })
    }
  }

  const imageFromLibrary = async () => {
    return attachImage(false)
  }

  const imageFromCamera = async () => {
    return attachImage(true)
  }

  const removeImage = (image: string) => {
    const updatedImages = images.filter(i => i !== image)
    setImages(updatedImages)
    setValue(props.objectTitle, updatedImages)
  }

  const showRemoveImage = (image: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('delete image?'),
      okLabel: t('delete'),
      cancelLabel: t('cancel'),
      onOk: () => removeImage(image)
    }))
  }

  const errorMessageTranslation = (errorMessage: string): Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={{ color: Colors.dangerButton2 }}>{errorTranslation}</Text>
  }

  const renderImages = () => {
    return images.map((image: string) =>
      <View key={image} style={Cs.imageContainer}>
        <ImageBackground
          source={{ uri: image }}
          style={{ width: 150, height: 150 }}
        >
          <View style={Cs.deleteImageIconContainer}>
            <Icon
              name='delete'
              type='material-icons'
              color={Colors.dangerButton2}
              size={22}
              onPress={() => { showRemoveImage(image) }}
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
          render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
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
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={imageFromLibrary}
                title={t('choose image')} height={40} width={140} buttonStyle={Bs.addImageButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'photo-library'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={imageFromCamera}
                title={t('use camera')} height={40} width={140} buttonStyle={Bs.addImageButton}
                gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'add-a-photo'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
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
          render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
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
            <View style={Cs.imageButtonsRowContainer}>
              <View style={Cs.padding5Container}>
                <ButtonComponent onPressFunction={imageFromLibrary}
                  title={t('choose image')} height={40} width={140} buttonStyle={Bs.addImageButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'photo-library'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              </View>
              <View style={Cs.padding5Container}>
                <ButtonComponent onPressFunction={imageFromCamera}
                  title={t('use camera')} height={40} width={140} buttonStyle={Bs.addImageButton}
                  gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
                  textStyle={Ts.buttonText} iconName={'add-a-photo'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
                />
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }
}

export default ImagePickerComponent
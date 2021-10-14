import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, ImageBackground, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import RadioForm from 'react-native-simple-radio-button'
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

interface RadioPropsType {
  label: string,
  value: string | number
}

type Props = {
  title: string,
  params: Record<string, any>,
  objectTitle: string,
  defaultValue: Array<Record<string, any>>,
  lang: string,
}

const ImagePickerKeywordComponent = (props: Props) => {
  const { register, setValue, setError, clearErrors, formState } = useFormContext()
  const [images, setImages] = useState<Array<Record<string, any>>>(Array.isArray(props.defaultValue) ? props.defaultValue : [])
  const { t } = useTranslation()
  const keywords: Record<string, any> = props.params
  const localized: string[] = props.params[props.lang]

  const dispatch: DispatchType = useDispatch()

  useEffect(() => {
    register(props.objectTitle)
    setValue(props.objectTitle, images)
  }, [])

  const radioProps: RadioPropsType[] = localized.map((localized, index) => {
    return {
      label: localized,
      value: index
    }
  })

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

        setImages(images.concat({
          uri,
          keywords: ''
        }))
        setValue(props.objectTitle, images.concat({
          uri,
          keywords: ''
        }))
      }
      return !pickerResult.cancelled

    } catch (error) {
      setError(props.objectTitle, { message: 'image attachment failure', type: 'manual' })
      log.error({
        location: '/components/formComponents/FormImagePickerKeywordComponent attachImage()',
        error: error
      })
      setTimeout(() => {
        clearErrors(props.objectTitle)
      }, 5000)
    }
  }

  const imageFromLibrary = async () => {
    return attachImage(false)
  }

  const imageFromCamera = async () => {
    return attachImage(true)
  }

  const removeImage = (image: string) => {
    const updatedImages = images.filter(i => i.uri !== image)
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

  const onRadioButtonSelect = (value: number, uri: string) => {
    const updatedImages: Record<string, any>[] = images.map(image => {
      if (image.uri === uri) {
        return {
          uri,
          keywords: localized[value],
        }
      } else {
        return image
      }
    })

    setImages(updatedImages)
    setValue(props.objectTitle, updatedImages)
  }

  const errorMessageTranslation = (errorMessage: string): Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={{ color: Colors.dangerButton2 }}>{errorTranslation}</Text>
  }

  const renderImages = () => {
    return images.map((image: Record<string, any>) => {
      let initial: number = -1

      //checks the keywords of all languages to find out which index was chosen in the radio button
      const indexFi: number = keywords.fi.findIndex((keyword: string) => keyword === image.keywords)
      if (indexFi !== -1) { initial = indexFi }
      const indexSv: number = keywords.sv.findIndex((keyword: string) => keyword === image.keywords)
      if (indexSv !== -1) { initial = indexSv }
      const indexEn: number = keywords.en.findIndex((keyword: string) => keyword === image.keywords)
      if (indexEn !== -1) { initial = indexEn }

      return (
        <View key={image.uri} style={Cs.keywordImageContainer}>
          <ImageBackground
            source={{ uri: image.uri }}
            style={{ width: 150, height: 150 }}
          >
            <View style={Cs.deleteImageIconContainer}>
              <Icon
                name='delete'
                type='material-icons'
                color={Colors.dangerButton2}
                size={22}
                onPress={() => { showRemoveImage(image.uri) }}
              />
            </View>
          </ImageBackground>
          <View style={{ marginTop: 5 }}>
            <RadioForm
              radio_props={radioProps}
              initial={initial}
              onPress={(value) => { onRadioButtonSelect(value, image.uri) }}
            />
          </View>
        </View>
      )
    }
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

export default ImagePickerKeywordComponent
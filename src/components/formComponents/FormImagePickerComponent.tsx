import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, ImageBackground, ScrollView } from 'react-native'
import { Button as ButtonElement, Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { DispatchType, setMessageState } from '../../stores'
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
    setValue(props.objectTitle, images)
  }, [])

  const attachImage = async (useCamera: boolean) => {
    try {
      let permissionResult: ImagePicker.PermissionResponse
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      } else {
        permissionResult = await ImagePicker.requestCameraRollPermissionsAsync()
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

      let succeeded: boolean = !pickerResult.cancelled
      let uri = pickerResult.uri
      if (succeeded) {
        setImages(images.concat(uri))
        setValue(props.objectTitle, images.concat(uri))
      }

      return succeeded
    } catch (err) {
      setError(props.objectTitle, { message: 'Error while attaching image', type: 'manual' })
      log.error({
        location: '/components/formComponents/FormImagePickerComponent attachImage()',
        error: JSON.stringify(err)
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
      <View key={image} style={Cs.singleImageContainer}>
        <ImageBackground
          source={{ uri: image }}
          style={{ width: 150, height: 150 }}
        >
          <View style={Cs.removeIconContainer}>
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
          style={Cs.imageElementRowContainer}
          ref={register({ name: props.objectTitle })}
        >
          {images.length === 0 ?
            <View style={Cs.noImageContainer}>
              <Text style={Ts.noImageText}>{t('no image')}</Text>
            </View>
            : renderImages()
          }
          <View style={Cs.imageButtonsColumnContainer}>
            <ButtonElement
              buttonStyle={Bs.addImageButton}
              containerStyle={Cs.padding5Container}
              title={' ' + t('choose image')}
              icon={<Icon name='photo-library' type='material-icons' color='white' size={22} />}
              onPress={imageFromLibrary}
            />
            <ButtonElement
              buttonStyle={Bs.addImageButton}
              containerStyle={Cs.padding5Container}
              title={' ' + t('use camera')}
              icon={<Icon name='add-a-photo' type='material-icons' color='white' size={22} />}
              onPress={imageFromCamera}
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
          render={({ message }) => <Text style={{ color: Colors.dangerButton2 }}>{errorMessageTranslation(message)}</Text>}
        />
        <View style={{ paddingLeft: 10 }}>
          <Text>{props.title}</Text>
        </View>
        <View
          style={Cs.imageElementColumnContainer}
          ref={register({ name: props.objectTitle })}
        >
          <View style={{ paddingLeft: 10 }}>
            <Text>{props.title}</Text>
          </View>
          <View style={Cs.imagesContainer}>
            <ScrollView horizontal={true}>
              {renderImages()}
            </ScrollView>
            <View style={Cs.imageButtonsRowContainer}>
              <ButtonElement
                buttonStyle={Bs.addImageButton}
                containerStyle={Cs.padding5Container}
                title={' ' + t('choose image')}
                icon={<Icon name='photo-library' type='material-icons' color='white' size={22} />}
                onPress={imageFromLibrary}
              />
              <ButtonElement
                buttonStyle={Bs.addImageButton}
                containerStyle={Cs.padding5Container}
                title={' ' + t('use camera')}
                icon={<Icon name='add-a-photo' type='material-icons' color='white' size={22} />}
                onPress={imageFromCamera}
              />
            </View>
          </View>
        </View>
      </>
    )
  }
}

export default ImagePickerComponent
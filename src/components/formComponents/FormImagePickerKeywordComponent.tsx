import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, ScrollView } from 'react-native'
import { Button as ButtonElement, Icon } from 'react-native-elements'
import RadioForm from 'react-native-simple-radio-button'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import * as ImagePicker from 'expo-image-picker'
import Colors from '../../styles/Colors'
import { setMessageState } from '../../stores/message/actions'
import { connect, ConnectedProps } from 'react-redux'
import { useFormContext } from 'react-hook-form'

interface RadioPropsType {
  label: string,
  value: string | number
}

const mapDispatchToProps = {
  setMessageState
}

const connector = connect(
  null,
  mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  title: string,
  params: Record<string, any>,
  objectTitle: string,
  defaultValue: Array<Record<string, any>>,
  lang: string,
}

const ImagePickerKeywordComponent = (props: Props) => {
  const { register, setValue } = useFormContext()
  const [images, setImages] = useState<Array<Record<string, any>>>(Array.isArray(props.defaultValue) ? props.defaultValue : [])
  const { t } = useTranslation()
  const keywords: string[] = props.params.keywords
  const localized: string[] = props.params[props.lang]

  useEffect(() => {
    setValue(props.objectTitle, images)
  }, [])

  const radioProps: RadioPropsType[] = localized.map((localized, index) => {
    return {
      label: localized,
      value: index
    }
  })

  const attachImage = async (useCamera: boolean) => {
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

    let succeeded : boolean = !pickerResult.cancelled
    let uri = pickerResult.uri
    if (succeeded) {
      setImages(images.concat({
        uri,
        keywords: ''
      }))
      setValue(props.objectTitle, images.concat({
        uri,
        keywords: ''
      }))
    }

    return succeeded
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
    props.setMessageState({
      type: 'dangerConf',
      messageContent: t('delete image?'),
      okLabel: t('delete'),
      cancelLabel: t('cancel'),
      onOk: () => removeImage(image)
    })
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

  const renderImages = () => {
    return images.map((image: Record<string, any>) => {
      const initial = keywords.findIndex(keyword => keyword === image.keywords)

      return (
        <View key={image.uri} style={Cs.keywordSingleImageContainer}>
          <ImageBackground
            source={{ uri: image.uri }}
            style={{ width: 150, height: 150 }}
          >
            <View style={Cs.removeIconContainer}>
              <Icon
                name='delete'
                type='material-icons'
                color={Colors.negativeColor}
                size={22}
                onPress={() => {showRemoveImage(image.uri)}}
              />
            </View>
          </ImageBackground>
          <View style={{ marginTop: 5 }}>
            <RadioForm
              radio_props={radioProps}
              initial={initial}
              onPress={(value) => {onRadioButtonSelect(value, image.uri)}}
            />
          </View>
        </View>
      )}
    )
  }

  //if there are less than two images, render buttons next to image
  if (images.length < 2) {
    return (
      <>
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
              title={t('choose image')}
              iconRight={true}
              icon={<Icon name='photo-library' type='material-icons' color='white'  size={22} />}
              onPress={imageFromLibrary}
            />
            <ButtonElement
              buttonStyle={Bs.addImageButton}
              containerStyle={Cs.padding5Container}
              title={t('use camera')}
              iconRight={true}
              icon={<Icon name='add-a-photo' type='material-icons' color='white'  size={22} />}
              onPress={imageFromCamera}
            />
          </View>
        </View>
      </>
    )
  } else {
    return (
      <>
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
                title={t('choose image')}
                iconRight={true}
                icon={<Icon name='photo-library' type='material-icons' color='white'  size={22} />}
                onPress={imageFromLibrary}
              />
              <ButtonElement
                buttonStyle={Bs.addImageButton}
                containerStyle={Cs.padding5Container}
                title={t('use camera')}
                iconRight={true}
                icon={<Icon name='add-a-photo' type='material-icons' color='white'  size={22} />}
                onPress={imageFromCamera}
              />
            </View>
          </View>
        </View>
      </>
    )
  }
}

export default connector(ImagePickerKeywordComponent)
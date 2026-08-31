import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import RadioForm from 'react-native-simple-radio-button'
import { useTranslation } from 'react-i18next'
import { DispatchType, setMessageState } from '../../stores'
import ButtonComponent from '../general/ButtonComponent'
import Cs from '../../styles/ContainerStyles'
import Bs from '../../styles/ButtonStyles'
import Ts from '../../styles/TextStyles'
import { createImage, ImageType } from '../../helpers/imageHelper'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

interface RadioPropsType {
  label: string,
  value: string | number
}

type Props = {
  title: string,
  params: Record<string, any>,
  objectTitle: string,
  defaultValue: ImageType[],
  lang: string,
}

const ImagePickerKeywordComponent = (props: Props) => {
  const { register, setValue, formState } = useFormContext()
  const [images, setImages] = useState<ImageType[]>(Array.isArray(props.defaultValue) ? props.defaultValue : [])
  const [loading, setLoading] = useState<boolean>(false)
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
      setLoading(true)
      const newImage = await createImage(useCamera)
      setImages(images.concat(newImage))
      setValue(props.objectTitle, images.concat(newImage))
    } catch (error: any) {
      if (error.severity === 'high') {
        showError(error.message)
      }
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

  const deleteImage = (uri: string) => {
    const updatedImages = images.filter(i => i.uri !== uri)
    setImages(updatedImages)
    setValue(props.objectTitle, updatedImages)
  }

  const showDeleteImage = (uri: string) => {
    dispatch(setMessageState({
      type: 'dangerConf',
      messageContent: t('delete image?'),
      okLabel: t('delete'),
      cancelLabel: t('cancel'),
      onOk: () => deleteImage(uri)
    }))
  }

  const showError = (error: string) => {
    dispatch(setMessageState({
      type: 'err',
      messageContent: error
    }))
  }

  const onRadioButtonSelect = (value: number, uri: string) => {
    const updatedImages: ImageType[] = images.map(image => {
      if (image.uri === uri) {
        return {
          ...image,
          keywords: localized[value],
        }
      } else {
        return image
      }
    })

    setImages(updatedImages)
    setValue(props.objectTitle, updatedImages)
  }

  const errorMessageTranslation = (errorMessage: string): React.JSX.Element => {
    const errorTranslation = t(errorMessage)
    return <Text style={Ts.redText}>{errorTranslation}</Text>
  }

  const renderImages = () => {
    return images.map((image: ImageType) => {
      let initial = -1

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
                color={'red'}
                size={22}
                onPress={() => { showDeleteImage(image.uri) }}
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

export default ImagePickerKeywordComponent

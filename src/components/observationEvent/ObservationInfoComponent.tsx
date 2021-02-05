import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { createSchemaObjectComponents } from '../../parsers/SchemaObjectParser'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import { SchemaType } from '../../stores/observation/types'
import MiniMapComponent from './MiniMapComponent'
import { JX519Fields, JX652Fields } from '../../config/fields'
import i18n from '../../language/i18n'

interface RootState {
  schema: SchemaType,
}

const mapStateToProps = (state: RootState) => {
  const { schema } = state
  return { schema }
}

const connector = connect(
  mapStateToProps,
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  event: Record<string, any>,
  observation: Record<string, any>,
  editButton: any,
  removeButton: any,
}

const ObservationInfoComponent = (props: Props) => {

  const [list, setList] = useState<Array<any> | null>(null)
  const { t } = useTranslation()

  useEffect(() => {

    const initList = async () => {
      let fields: string[] | null = null

      if (props.event.formID === 'JX.519') {
        fields = JX519Fields
      } else if (props.event.formID === 'JX.652') {
        fields = JX652Fields
      }
      if (schema && fields) {
        setList(await createSchemaObjectComponents(props.observation, fields, schema))
      }
    }

    initList()
  }, [])

  const lang = i18n.language
  const schema = props.schema[lang]?.schema?.properties?.gatherings?.items?.properties?.units

  if (!schema) {
    return null
  }

  return (
    <View style={Cs.observationInfoContainer}>
      <MiniMapComponent observation={props.observation} event={props.event} />
      {list}
      {props.observation.images !== undefined && props.observation.images.length > 0 ?
        <View>
          <View style={Cs.observationListLine}>
            <View style={Cs.observationPropertyTitle}>
              <Text style={Ts.boldText}>{t('images')}</Text>
            </View>
          </View>
          <ScrollView horizontal={true} style={Cs.observationInfoImageContainer}>
            {props.observation.images.map((image: any) => {
              let uri = ''
              if (typeof image === 'object') {
                uri = image.uri
              } else {
                uri = image
              }

              return (
                <View style={{ paddingRight: 5 }} key={uri}>
                  <Image
                    source={{ uri: uri }}
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              )
            })}
          </ScrollView>
        </View>
        : null
      }

      <View style={Cs.editObservationButtonContainer}>
        <View style={Cs.singleButton}>
          {props.editButton}
        </View>
        <View style={Cs.singleButton}>
          {props.removeButton}
        </View>
      </View>
    </View>
  )
}

export default connector(ObservationInfoComponent)
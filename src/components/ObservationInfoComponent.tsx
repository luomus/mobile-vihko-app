import React from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { createSchemaObjectComponents } from '../parsers/SchemaObjectParser'
import { useTranslation } from 'react-i18next'
import Cs from '../styles/ContainerStyles'
import Ts from '../styles/TextStyles'
import { SchemaType } from '../stores/observation/types'
import MiniMapComponent from './MiniMapComponent'
import i18n from '../language/i18n'

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
  const { t } = useTranslation()

  const lang = i18n.language
  const schema = props.schema.schemas[lang]?.schema?.properties?.gatherings?.items?.properties?.units
  const fieldScopes = props.schema.schemas[lang]?.uiSchemaParams?.unitFieldScopes

  if (!schema) {
    return null
  }

  const getFields = () => {
    const rules = props.observation.rules

    if (!rules || !fieldScopes) {
      return null
    }

    return Object.keys(fieldScopes[rules.field]).reduce((foundObject: Record<string, any> | null, key) => {
      const matches = new RegExp(rules.regexp).test(key)
      if (rules.complement ? !matches : matches) {
        return fieldScopes[rules.field][key]
      } else {
        return foundObject
      }
    }, null)?.fields
  }

  const fields = getFields()

  return (
    <View style={Cs.observationInfoContainer}>
      <MiniMapComponent observation={props.observation} event={props.event} />
      {(schema && fields) ? createSchemaObjectComponents(props.observation, fields, schema) : null}
      {props.observation.images !== undefined && props.observation.images.length > 0 ?
        <View>
          <View style={Cs.observationListLine}>
            <View style={Cs.observationPropertyTitle}>
              <Text style={Ts.boldText}>{t('images')}</Text>
            </View>
          </View>
          <ScrollView horizontal={true} style={Cs.observationInfoImageContainer}>
            {props.observation.images.map((uri: string) => (
              <View style={{ paddingRight: 5 }} key={uri}>
                <Image
                  source={{ uri: uri }}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            ))}
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
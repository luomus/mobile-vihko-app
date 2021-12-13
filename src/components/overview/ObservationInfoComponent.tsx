import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { createSchemaObjectComponents } from '../../helpers/parsers/SchemaObjectParser'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import MiniMapComponent from './MiniMapComponent'
import { JX519Fields, JX652Fields } from '../../config/fields'
import { useSelector } from 'react-redux'
import { rootState } from '../../stores'

type Props = {
  event: Record<string, any>,
  observation: Record<string, any>,
  eventSchema: Record<string, any>,
  editButton: any,
  removeButton: any,
}

const ObservationInfoComponent = (props: Props) => {

  const [list, setList] = useState<Array<any> | null>(null)
  const { t } = useTranslation()

  const credentials = useSelector((state: rootState) => state.credentials)

  const schemaUnits = props.eventSchema.schema?.properties?.gatherings?.items?.properties?.units

  if (!schemaUnits) {
    return null
  }

  useEffect(() => {
    const initList = async () => {

      let fields: string[] | null = null

      //on the flying squirrel form, there's a logic in fetching the shown fields, other forms just check them from an array
      if (props.event.formID === 'MHL.45') {
        const fieldScopes = props.eventSchema.uiSchemaParams?.unitFieldScopes
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

        fields = getFields()

      } else if (props.event.formID === 'JX.519') {
        fields = JX519Fields
      } else if (props.event.formID === 'JX.652') {
        fields = JX652Fields
      }

      if (schemaUnits && fields) {
        setList(await createSchemaObjectComponents(props.observation, fields, schemaUnits, credentials))
      }
    }

    initList()
  }, [props.observation])

  if (list === null) {
    return null
  } else {
    return (
      <View style={Cs.observationInfoContainer}>
        <MiniMapComponent observation={props.observation} event={props.event} />
        {list}
        {props.observation.images !== undefined && props.observation.images.length > 0 ?
          <View>
            <View style={Cs.observationListElementTextContainer}>
              <View style={Cs.observationListElementTitlesContainer}>
                <Text style={Ts.boldText}>{t('images')}</Text>
              </View>
            </View>
            <ScrollView horizontal={true} style={Cs.observationListElementImageContainer}>
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

        <View style={Cs.observationListElementButtonsContainer}>
          <View style={Cs.padding5Container}>
            {props.editButton}
          </View>
          <View style={Cs.padding5Container}>
            {props.removeButton}
          </View>
        </View>
      </View>
    )
  }
}

export default ObservationInfoComponent
import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { createSchemaObjectComponents } from '../../helpers/parsers/SchemaObjectParser'
import { useTranslation } from 'react-i18next'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
// import MiniMapComponent from './MiniMapComponent'
import {
  forms,
  JX519Fields, MHL117Fields, JX652Fields, MHL932Fields,
  MHL1040Fields, MHL1042Fields, MHL1043Fields, MHL1044Fields,
  MHL1045Fields, MHL1046Fields, MHL1047Fields, MHL1048Fields,
  MHL1062Fields,
  singleObservationFields
} from '../../config/fields'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'

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

  const credentials = useSelector((state: RootState) => state.credentials)

  const schemaDocument = props.eventSchema.schema
  const schemaUnits = props.eventSchema.schema?.properties?.gatherings?.items?.properties?.units

  if (!schemaUnits) {
    return null
  }

  useEffect(() => {
    const initList = async () => {

      let fields: string[] | null = null

      //on the flying squirrel form, there's a logic in fetching the shown fields, other forms just check them from an array
      if (props.event.formID === forms.lolife) {
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

      } else if (props.event.formID === forms.tripForm) {
        fields = props.event.singleObservation ? singleObservationFields : JX519Fields
      } else if (props.event.formID === forms.birdAtlas) {
        fields = MHL117Fields
      } else if (props.event.formID === forms.fungiAtlas) {
        fields = JX652Fields
      } else if (props.event.formID === forms.dragonflyForm) {
        fields = MHL932Fields
      } else if (props.event.formID === forms.butterflyForm) {
        fields = MHL1040Fields
      } else if (props.event.formID === forms.largeFlowersForm) {
        fields = MHL1042Fields
      } else if (props.event.formID === forms.mothForm) {
        fields = MHL1043Fields
      } else if (props.event.formID === forms.bumblebeeForm) {
        fields = MHL1044Fields
      } else if (props.event.formID === forms.herpForm) {
        fields = MHL1045Fields
      } else if (props.event.formID === forms.subarcticForm) {
        fields = MHL1046Fields
      } else if (props.event.formID === forms.macrolichenForm) {
        fields = MHL1047Fields
      } else if (props.event.formID === forms.bracketFungiForm) {
        fields = MHL1048Fields
      } else if (props.event.formID === forms.practicalFungiForm) {
        fields = MHL1062Fields
      }

      if (props.event.singleObservation && schemaDocument && schemaUnits && fields) {
        const unitFields = fields.filter(field => { return field !== 'secureLevel' && !field.includes('gatheringEvent') })
        const documentFields = fields.filter(field => { return !unitFields.includes(field) })
        const unitFieldList = await createSchemaObjectComponents(props.observation, unitFields, schemaUnits, credentials)
        const documentFieldList = await createSchemaObjectComponents(props.event, documentFields, schemaDocument, credentials)
        setList(unitFieldList.concat(documentFieldList))
      } else if (schemaUnits && fields) {
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
        {/* {props.observation.unitGathering?.geometry
          ? <MiniMapComponent geometry={props.observation.unitGathering.geometry} color={props.observation.color} />
          : null} */}
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
                let uri = '' // change this to "let uri = image.uri" after users have had time to update the app
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
          {props.editButton}
          {props.removeButton}
        </View>
      </View>
    )
  }
}

export default ObservationInfoComponent
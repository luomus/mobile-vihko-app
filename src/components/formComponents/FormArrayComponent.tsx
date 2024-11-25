import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'
import uuid from 'react-native-uuid'

interface Props {
  title: string,
  objectTitle: string,
  parentObjectTitle: string,
  inputType: string,
  defaultValue: Array<string> | undefined,
  editable: boolean,
  firstEditable: boolean,
  scrollView: React.MutableRefObject<ScrollView | null>,
  createInputElement: (
    title: string, objectTitle: string, parentObjectTitle: string,
    type: string, defaultValue: string | number | Array<string> | undefined, isArrayItem: boolean,
    callbackFunction: ((childValue: any) => void) | undefined, editable: boolean
  ) => React.JSX.Element | undefined
}

const FormArrayComponent = (props: Props) => {
  const [inputElements, setInputElements] = useState<Array<React.JSX.Element | undefined>>([])
  const indexOfRemovable = props.firstEditable ? 0 : 1
  const { register, setValue, watch, getValues } = useFormContext()
  const [elementDictionary, setElementDictionary] = useState<Record<string, any>>({})
  const stateRef = useRef<Record<string, any>>()
  const arrayRef = useRef<View | null>(null)
  stateRef.current = elementDictionary

  useEffect(() => {
    //if there are default values for the array, we iterate them, create the according input elements and pass the elements to FormArrayComponent
    const inputElems: Array<React.JSX.Element | undefined> = []

    if (props.parentObjectTitle !== '') {
      register(props.parentObjectTitle)
      setValue(props.parentObjectTitle, []) // Adds empty array to register
    }

    const newElementDictionary: Record<string, any> = {}
    const values: Array<number | string | undefined> = []

    //make first input uneditabel if set as such
    if (!props.firstEditable && props.defaultValue) {
      props.defaultValue.forEach((value, index) => {
        let defaultIsEditable = true
        if (index === 0) {
          defaultIsEditable = false
        }

        const childObjectTitle = props.parentObjectTitle + ' ' + uuid.v4()

        newElementDictionary[childObjectTitle] = value
        values.push(value)

        inputElems.push(props.createInputElement(
          childObjectTitle, childObjectTitle, props.parentObjectTitle, props.inputType, value,
          true, callbackFunction, defaultIsEditable))
      })
    } else if (props.defaultValue) {
      props.defaultValue.forEach((value) => {
        const childObjectTitle = props.parentObjectTitle + ' ' + uuid.v4()

        newElementDictionary[childObjectTitle] = value
        values.push(value)

        inputElems.push(props.createInputElement(
          childObjectTitle, childObjectTitle, props.parentObjectTitle, props.inputType, value,
          true, callbackFunction, true))
      })
    }

    setElementDictionary(newElementDictionary)
    setValue(props.parentObjectTitle, values)
    setInputElements(inputElems)
  }, [])

  const callbackFunction = (childValue: any) => { // Create callback function for fetching values from inputs
    addValueToArray(childValue)

    const newElementDictionary = { ...stateRef.current }
    newElementDictionary[childValue.objectTitle] = childValue.value
    setElementDictionary(newElementDictionary)
  }


  const addValueToArray = (childValue: any) => {
    const values = getValues(props.parentObjectTitle)
    const index = values.indexOf(stateRef.current?.[childValue.objectTitle])
    if (index > -1) {
      values.splice(index, 1)
    }
    values.push(childValue.value)
    setValue(props.parentObjectTitle, values)
  }

  const addInputElement = () => {
    const elements = [...inputElements]
    const childObjectTiltle = props.parentObjectTitle + ' ' + uuid.v4()
    const childDefaultValue = props.inputType === 'string' ? '' : undefined

    //create new input element
    const newInputElement = props.createInputElement(
      childObjectTiltle, childObjectTiltle, props.parentObjectTitle,
      props.inputType, childDefaultValue, true, callbackFunction, props.editable
    )
    elements.push(newInputElement)
    setInputElements(elements)

    //add new input field to elementDict
    const newElementDictionary = { ...elementDictionary }
    newElementDictionary[childObjectTiltle] = childDefaultValue
    setElementDictionary(newElementDictionary)

    //push value for new filed to array
    const values = getValues(props.parentObjectTitle)
    values.push(childDefaultValue)
    setValue(props.parentObjectTitle, values)

    //measure height of the array component and scroll below it, so the new input element won't be hidden under other components
    arrayRef.current?.measureInWindow((fx, fy, width, height) => {
      const measurements = {
        fx: fx,
        fy: fy,
        width: width,
        height: height,
      }

      props.scrollView.current?.scrollTo(0, (measurements.fy + measurements.height), false)
    })
  }

  //removes the last input element from form
  const removeInputElement = () => {
    const elements = [...inputElements]
    const elementToRemove = elements.pop()
    const elementKey = elementToRemove?.key

    if (!(elementToRemove && elementKey)) {
      return
    }

    const valueToRemove = elementDictionary[elementKey] //dictionary stores key-value pairs, where key is key/title of input and value is crrent value of input
    removeValueFromRegister(valueToRemove)
    setInputElements(elements)

    const newElementDictionay = { ...elementDictionary }
    delete newElementDictionay[elementKey]
    setElementDictionary(newElementDictionay)
  }

  //gets values stored in register, removes the value to remove and replaces register entry with modified array
  const removeValueFromRegister = (value: string) => {
    const values = watch(props.parentObjectTitle)
    const index = values.indexOf(value)
    if (index > -1) {
      values.splice(index, 1)
    }
    setValue(props.parentObjectTitle, values)
  }

  return (
    <View style={Cs.padding10Container} collapsable={false} ref={arrayRef}>
      <Text>{props.title}</Text>
      <View style={Cs.formArrayInputListContainer}>
        {inputElements}
        <View style={Cs.formArrayButtonContainer}>
          <ButtonComponent onPressFunction={() => addInputElement()} title={undefined}
            height={40} width={45} buttonStyle={Bs.iconButton}
            gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
            textStyle={Ts.buttonText} iconName={'add'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
          />
          {inputElements.length > indexOfRemovable
            ?
            <ButtonComponent onPressFunction={() => removeInputElement()} title={undefined}
              height={40} width={45} buttonStyle={Bs.iconButton}
              gradientColorStart={Colors.neutralButton} gradientColorEnd={Colors.neutralButton} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'remove'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
            : null
          }
        </View>
      </View>
    </View>
  )
}

export default FormArrayComponent
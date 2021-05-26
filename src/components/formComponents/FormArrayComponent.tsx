import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView } from 'react-native'
import ButtonComponent from '../general/ButtonComponent'
import Bs from '../../styles/ButtonStyles'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { useFormContext } from 'react-hook-form'

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
    type: string, defaultValue: string, isArrayItem: boolean,
    callbackFunction: Function | undefined, editable: boolean
  ) => JSX.Element | undefined
}

const FormArrayComponent = (props: Props) => {
  const [inputElements, setInputElements] = useState<Array<JSX.Element | undefined>>([])
  const indexOfRemovable = props.firstEditable ? 0 : 1
  const { register, setValue, unregister, watch } = useFormContext()
  let elementDictionary: Record<string, any> = {}

  useEffect(() => {
    //if there are default values for the array, we iterate them, create the according input elements and pass the elements to FormArrayComponent
    let inputElems: Array<JSX.Element | undefined> = []

    if (props.parentObjectTitle !== '') {
      register({ name: props.parentObjectTitle })
      setValue(props.parentObjectTitle, []) // Adds empty array to register
    }

    //make first input uneditabel if set as such
    if (!props.firstEditable && props.defaultValue) {
      props.defaultValue.forEach((value, index) => {
        let defaultIsEditable = true
        if (index === 0) {
          defaultIsEditable = false
        }

        inputElems.push(props.createInputElement(
          props.title, props.objectTitle, props.parentObjectTitle, props.inputType, value,
          true, callbackFunction, defaultIsEditable))
      })
    } else if (props.defaultValue) {
      props.defaultValue.forEach((value) => inputElems.push(props.createInputElement(
        props.title, props.objectTitle, props.parentObjectTitle, props.inputType, value,
        true, callbackFunction, true)))
    }

    setInputElements(inputElems)
  }, [])

  const callbackFunction = (childValue: any) => { // Create callback function for fetching values from inputs
    elementDictionary[childValue.title] = childValue.value
  }

  const addInputElement = () => {
    const elements = [...inputElements]
    elements.push(props.createInputElement(
      props.title, props.objectTitle, props.parentObjectTitle,
      props.inputType, '', true, callbackFunction, props.editable
    ))
    setInputElements(elements)

    //scroll down, as the new element appears
    if (props.scrollView !== null) {
      setTimeout(() => {
        props.scrollView.current?.scrollToEnd()
      }, 100)
    }
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
    delete elementDictionary[elementKey]
    setInputElements(elements)
  }

  //gets values stored in register, removes the value to remove and replaces register entry with modified array
  const removeValueFromRegister = (value: string) => {
    const values = watch(props.parentObjectTitle)
    const index = values.indexOf(value)
    if (index > -1) {
      values.splice(index, 1)
    }
    unregister(props.parentObjectTitle)
    register({ name: props.parentObjectTitle })
    setValue(props.parentObjectTitle, values)
  }

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.formAllInputsContainer}>
        {inputElements}
        <View style={Cs.formArrayButtonContainer}>
          <View style={Cs.padding5Container}>
            <ButtonComponent onPressFunction={() => addInputElement()} title={undefined}
              height={40} width={45} buttonStyle={Bs.addIconButton}
              gradientColorStart={Colors.neutral} gradientColorEnd={Colors.neutral} shadowColor={Colors.neutralShadow}
              textStyle={Ts.buttonText} iconName={'add'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
            />
          </View>
          {inputElements.length > indexOfRemovable
            ?
            <View style={Cs.padding5Container}>
              <ButtonComponent onPressFunction={() => removeInputElement()} title={undefined}
                height={40} width={45} buttonStyle={Bs.addIconButton}
                gradientColorStart={Colors.neutral} gradientColorEnd={Colors.neutral} shadowColor={Colors.neutralShadow}
                textStyle={Ts.buttonText} iconName={'remove'} iconType={'material-icons'} iconSize={22} contentColor={Colors.darkText}
              />
            </View>
            : null
          }
        </View>
      </View>
    </View>
  )
}

export default FormArrayComponent
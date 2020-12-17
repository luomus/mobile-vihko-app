import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { createInputElement } from '../../builders/FormComponentBuilders'
import Cs from '../../styles/ContainerStyles'
import Colors from '../../styles/Colors'

interface Props {
  title: string,
  objectTitle: string,
  parentObjectTitle: string,
  inputType: string,
  register: Function,
  setValue: Function,
  watch: Function,
  errors: Object,
  unregister: Function,
  inputElements: Array<Element | undefined>,
  elementDictionary: any,
  callbackFunction: Function | undefined,
  editable: boolean,
  firstEditable: boolean,
}

const FormArrayComponent = (props: Props) => {

  const [inputElements, setInputElements] = useState(props.inputElements)
  const indexOfRemovable = props.firstEditable ? 0 : 1

  const addInputElement = () => {
    const elements = [...inputElements]
    elements.push(createInputElement(
      props.title, props.objectTitle, props.parentObjectTitle,
      props.inputType, '', props.register, props.setValue,
      props.watch, props.errors, props.unregister, true,
      props.callbackFunction, props.editable
    ))
    setInputElements(elements)
  }

  //removes the last input element from form
  const removeInputElement = () => {
    const elements = [...inputElements]
    const elementToRemove = elements.pop()
    const elementKey = elementToRemove.key
    const valueToRemove = props.elementDictionary[elementKey] //dictionary stores key-value pairs, where key is key/title of input and value is crrent value of input
    removeValueFromRegister(valueToRemove)
    delete props.elementDictionary[elementKey]
    setInputElements(elements)
  }

  //gets values stored in register, removes the value to remove and replaces register entry with modified array
  const removeValueFromRegister = (value: string) => {
    const values = props.watch(props.parentObjectTitle)
    const index = values.indexOf(value)
    if (index > -1) {
      values.splice(index, 1)
    }
    props.unregister(props.parentObjectTitle)
    props.register({ name: props.parentObjectTitle })
    props.setValue(props.parentObjectTitle, values)
  }

  return (
    <View style={Cs.containerWithJustPadding}>
      <Text>{props.title}</Text>
      <View style={Cs.formAllInputsContainer}>
        {inputElements}
        <View style={Cs.formArrayButtonContainer}>
          <Button
            buttonStyle={{ backgroundColor: Colors.positiveButton }}
            icon={<Icon name={'add'} color='white' size={22} />}
            onPress={() => addInputElement()}
          />
          {inputElements.length > indexOfRemovable
            ? <Button
              icon={<Icon name={'remove'} color='white' size={22} />}
              buttonStyle={{ backgroundColor: Colors.negativeButton }}
              onPress={() => removeInputElement()}
            />
            : null
          }
        </View>
      </View>
    </View>
  )
}

export default FormArrayComponent
import React from 'react'
import FormInputComponent from '../components/formComponents/FormInputComponent'
import FormImagePickerComponent from '../components/formComponents/FormImagePickerComponent'
import FormImageKeywordPickerComponent from '../components/formComponents/FormImagePickerKeywordComponent'
import FormArrayComponent from '../components/formComponents/FormArrayComponent'
import FormPickerItemComponent from '../components/formComponents/FormPickerItemComponent'
import FormPickerComponent from '../components/formComponents/FormPickerComponent'
import FormDatePickerComponent from '../components/formComponents/FormDatePickerComponent'
import FormSwitchComponent from '../components/formComponents/FormSwitchComponent'
import uuid from 'react-native-uuid'
import FormHiddenComponent from '../components/formComponents/FormHiddenComponent'
import FormAutocompleteComponent, { AutocompleteParams } from '../components/formComponents/FormAutocompleteComponent'


export const createAutocompleteField = (
  title: string,
  objectTitle: string,
  defaultValue: string,
  register: Function,
  setValue: Function,
  watch: Function,
  unregister: Function,
  errors: Object,
  autocompleteParams: AutocompleteParams,
  lang: string,
  index: number,
) => {

  return <FormAutocompleteComponent
    key={objectTitle} title={title} defaultValue={defaultValue} register={register}
<<<<<<< HEAD
    setValue={setValue} watch={watch} unregister={unregister} errors={errors}
=======
    setValue={setValue} watch={watch} unregister={unregister}
>>>>>>> 22f3c0825d5920c71a9b87594b42df21415e0e17
    autocompleteParams={autocompleteParams} lang={lang} index={index}
  />
}

//creates a Picker component with PickerItems and takes JSON schema item label as parameter
export const createPicker = (
  title: string, objectTitle: string, defaultValue: string,
  register: Function, setValue: Function, watch: Function,
  errors: Object, unregister: Function, dictionary: { [key: string]: any },
  blacklist: string[] | null
) => {
  const pickerItems = []

  //create PickerItem for each key in dictionary object, exclude blacklisted items
  for (const key in dictionary) {
    if (!blacklist || !blacklist.includes(key)) {
      pickerItems.push(<FormPickerItemComponent key={key} label={dictionary[key]} value={key} />)
    }
  }

  //create picker component with created PickerItems as parameter
  return <FormPickerComponent
    key={objectTitle} title={title} objectTitle={objectTitle} pickerItems={pickerItems}
    selectedValue={defaultValue !== '' ? defaultValue : pickerItems[0].props.value} //if default value exists, set that as selected value, otherwise set the value of first picker item
    register={register} setValue={setValue} watch={watch} errors={errors} unregister={unregister}
  />
}

//create hidden component that just stores values for any fields not shown to user
export const createHidden = (
  objectTitle: string,
  defaultValue: any,
  register: Function,
  setValue: Function,
) => {
  return <FormHiddenComponent
    key={objectTitle}
    objectTitle ={objectTitle}
    defaultValue={defaultValue}
    register={register}
    setValue={setValue}
  />
}

export const createImagePicker = (
  title: string,
  objectTitle: string,
  defaultValue: Array<string>,
  register: Function,
  setValue: Function,
) => {
  return <FormImagePickerComponent
    key={objectTitle}
    title={title}
    objectTitle={objectTitle}
    defaultValue={defaultValue}
    register={register}
    setValue={setValue}
  />
}

export const createImageKeywordPicker = (
  title: string,
  objectTitle: string,
  defaultValue: Array<Record<string, any>>,
  register: Function,
  setValue: Function,
  params: any,
  lang: string,
) => {
  return <FormImageKeywordPickerComponent
    key={objectTitle}
    title={title}
    params={params}
    objectTitle={objectTitle}
    defaultValue={defaultValue}
    register={register}
    setValue={setValue}
    lang={lang}
  />
}

//create an array type input field
export const createArray = (
  title: string, objectTitle: string, parentObjectTitle: string, type: string,
  defaultValue: (Array<string>) | undefined, register: Function, setValue: Function,
  watch: Function, errors: Object, unregister: Function, editable: boolean, firstEditable: boolean
) => {
  let elementDictionary: { [key: string]: any } = {} // Create dictionary for handling removal of inputs

  const callbackFunction = (childValue: any) => { // Create callback function for fetching values from inputs
    elementDictionary[childValue.title] = childValue.value
  }

  if (parentObjectTitle !== '') {
    register({ name: parentObjectTitle })
    setValue(parentObjectTitle, []) // Adds empty array to register
  }

  //if there are default values for the array, we iterate them, create the according input elements and pass the elements to FormArrayComponent
  let inputElements: Array<Element | undefined> = []

  //make first input uneditabel if set as such
  if (!firstEditable && defaultValue) {
    defaultValue.forEach((value, index) => {
      let defaultIsEditable = true
      if (index === 0) {
        defaultIsEditable = false
      }

      inputElements.push(createInputElement(
        title, objectTitle, parentObjectTitle, type, value,
        register, setValue, watch, errors, unregister, true, callbackFunction, defaultIsEditable))
    })
  } else if (defaultValue) {
    defaultValue.forEach((value) => inputElements.push(createInputElement(
      title, objectTitle, parentObjectTitle, type, value,
      register, setValue, watch, errors, unregister, true, callbackFunction, true)))
  }

  return <FormArrayComponent
    key={parentObjectTitle} title={title} objectTitle={objectTitle} parentObjectTitle={parentObjectTitle}
    inputType={type} register={register} setValue={setValue} watch={watch} errors={errors}
    unregister={unregister} inputElements={inputElements} elementDictionary={elementDictionary}
    callbackFunction={callbackFunction} editable={editable} firstEditable={firstEditable}/>
}

export const createSwitch = (
  title: string, objectTitle: string, defaultValue: boolean, register: Function,
  setValue: Function, watch: Function, errors: Object, unregister: Function
) => {
  return <FormSwitchComponent key={objectTitle} title={title} objectTitle={objectTitle} defaultValue={defaultValue}
    register={register} setValue={setValue} watch={watch} errors={errors} unregister={unregister}/>
}

export const createInputElement = (
  title: string, objectTitle: string, parentObjectTitle: string,
  type: string, defaultValue: string, register: Function,
  setValue: Function, watch: Function, errors: Object,
  unregister: Function, isArrayItem: boolean, callbackFunction: Function|undefined, editable: boolean
) => {
  const titleKey = isArrayItem ? objectTitle + ' ' + uuid.v4() : objectTitle

  if (objectTitle.includes('dateBegin') || objectTitle.includes('dateEnd')) {
    return <FormDatePickerComponent
      key={titleKey} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='default' register={register} setValue={setValue}
      watch={watch} errors={errors} unregister={unregister}
      isArrayItem={isArrayItem} parentCallback={callbackFunction}
    />
  } else if (type === 'string') {
    return <FormInputComponent
      key={titleKey} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='default' register={register} setValue={setValue}
      watch={watch} errors={errors} unregister={unregister}
      isArrayItem={isArrayItem} parentCallback={callbackFunction} editable={editable}
    />
  } else if (type === 'integer') {
    return <FormInputComponent
      key={titleKey} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='numeric' register={register} setValue={setValue}
      watch={watch} errors={errors} unregister={unregister}
      isArrayItem={isArrayItem} parentCallback={callbackFunction} editable={editable}
    />
  }
}
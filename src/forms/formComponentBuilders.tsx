import React from 'react'
import { ScrollView } from 'react-native'
import FormInputComponent from '../components/formComponents/FormInputComponent'
import FormImagePickerComponent from '../components/formComponents/FormImagePickerComponent'
import FormImageKeywordPickerComponent from '../components/formComponents/FormImagePickerKeywordComponent'
import FormArrayComponent from '../components/formComponents/FormArrayComponent'
import FormPickerItemComponent from '../components/formComponents/FormPickerItemComponent'
import FormPickerComponent from '../components/formComponents/FormPickerComponent'
import FormDateOptionsComponent from '../components/formComponents/FormDateOptionsComponent'
import FormDatePickerComponent from '../components/formComponents/FormDatePickerComponent'
import FormSwitchComponent from '../components/formComponents/FormSwitchComponent'
import FormHiddenComponent from '../components/formComponents/FormHiddenComponent'
import FormAutocompleteComponent, { AutocompleteParams } from '../components/formComponents/FormAutocompleteComponent'

export const createAutocompleteField = (
  title: string,
  objectTitle: string,
  defaultValue: string,
  autocompleteParams: AutocompleteParams,
  lang: string,
  index: number,
) => {

  return <FormAutocompleteComponent
    key={objectTitle} title={title} defaultValue={defaultValue}
    autocompleteParams={autocompleteParams} lang={lang} index={index}
  />
}

//creates a Picker component with PickerItems and takes JSON schema item label as parameter
export const createPicker = (
  title: string, objectTitle: string, defaultValue: string,
  dictionary: { [key: string]: any },
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
  />
}

//create hidden component that just stores values for any fields not shown to user
export const createHidden = (
  objectTitle: string,
  defaultValue: any,
) => {
  return <FormHiddenComponent
    key={objectTitle}
    objectTitle ={objectTitle}
    defaultValue={defaultValue}
  />
}

export const createImagePicker = (
  title: string,
  objectTitle: string,
  defaultValue: Array<string>,
) => {
  return <FormImagePickerComponent
    key={objectTitle}
    title={title}
    objectTitle={objectTitle}
    defaultValue={defaultValue}
  />
}

export const createImageKeywordPicker = (
  title: string,
  objectTitle: string,
  defaultValue: Array<Record<string, any>>,
  params: any,
  lang: string,
) => {
  return <FormImageKeywordPickerComponent
    key={objectTitle}
    title={title}
    params={params}
    objectTitle={objectTitle}
    defaultValue={defaultValue}
    lang={lang}
  />
}

//create an array type input field
export const createArray = (
  title: string, objectTitle: string, parentObjectTitle: string, type: string,
  defaultValue: Array<string> | undefined, editable: boolean,
  firstEditable: boolean, scrollView: React.MutableRefObject<ScrollView | null>
) => {
  return <FormArrayComponent
    key={parentObjectTitle} title={title} objectTitle={objectTitle} parentObjectTitle={parentObjectTitle}
    inputType={type} defaultValue={defaultValue} editable={editable} firstEditable={firstEditable}
    scrollView={scrollView} createInputElement={createInputElement}
  />
}

export const createSwitch = (
  title: string, objectTitle: string, defaultValue: boolean
) => {
  return <FormSwitchComponent key={objectTitle} title={title} objectTitle={objectTitle} defaultValue={defaultValue}/>
}

export const createInputElement = (
  title: string, objectTitle: string, parentObjectTitle: string,
  type: string, defaultValue: string | string | number,
  isArrayItem: boolean, callbackFunction: Function|undefined, editable: boolean
) => {
  if ((objectTitle.includes('gatheringEvent_dateBegin') || objectTitle.includes('gatheringEvent_dateEnd')) && typeof defaultValue === 'string') {
    return <FormDatePickerComponent
      key={objectTitle} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='default'
      isArrayItem={isArrayItem} parentCallback={callbackFunction}
    />
  } else if (objectTitle.includes('unitGathering_dateBegin') && typeof defaultValue === 'string') {
    return <FormDateOptionsComponent
      key={objectTitle} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='default'
      isArrayItem={isArrayItem} parentCallback={callbackFunction}
    />
  } else if (type === 'string') {
    return <FormInputComponent
      key={objectTitle} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='default'
      isArrayItem={isArrayItem} parentCallback={callbackFunction} editable={editable}
    />
  } else if (type === 'integer') {
    return <FormInputComponent
      key={objectTitle} title={title} objectTitle={objectTitle}
      parentObjectTitle={parentObjectTitle} defaultValue={defaultValue}
      keyboardType='numeric'
      isArrayItem={isArrayItem} parentCallback={callbackFunction} editable={editable}
    />
  }
}
import AsyncStorage from '@react-native-async-storage/async-storage'

const save = async (key: string, value: any) => {
  const item = JSON.stringify(value)
  await AsyncStorage.setItem(key, item)
}

const fetch = async (key: string) => {
  const value: string | null = await AsyncStorage.getItem(key)
  if (value !== null) {
    return JSON.parse(value)
  } else {
    return null
  }
}

const getKeys = async () => {
  const allKeys: readonly string[] = await AsyncStorage.getAllKeys()
  return allKeys
}

const printValues = async () => {
  const keys = await getKeys()
  const items = await AsyncStorage.multiGet(keys)

  items.forEach((item) => {
    const key = item[0]
    const value = item[1]
    console.log(`${key}: ${value}`)
  })
}

const remove = async (key: string) => {
  await AsyncStorage.removeItem(key)
}

//caution: removes ALL stored keys from the storage!
const clear = async () => {
  await AsyncStorage.clear()
}

export default { save, fetch, getKeys, printValues, remove, clear }
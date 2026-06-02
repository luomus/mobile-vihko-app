import storageService from '../../services/storageService'

export const get = async (url: string, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('get(' + url + ')')
  console.error('Axios GET was called with url ' + url)
}

export const post = async (url: string, data: any, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('post(' + url + ')')
  console.error('Axios POST was called with url ' + url)
}

export const axiosDelete = async (url: string, config?: object) => {
  if (await storageService.fetch('testingInternetStatus') === 404) {
    throw {}
  }
  console.log('delete(' + url + ')')
  console.error('Axios DELETE was called with url ' + url)
}
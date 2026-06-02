import { lajiApi } from '../index'
import { LineString, MultiLineString, Point } from 'geojson'

const lajiApiService = {
  getForm: async (formId: string) => {
    const response = await lajiApi.get('/forms/' + formId)
    return response.data
  },
  getDocuments: async (selectedFields: string[], sourceID: string, pageSize: number) => {
    const response = await lajiApi.get('/documents', { params: { selectedFields, sourceID, pageSize } })
    return response.data.results
  },
  postDocument: async (document: Record<string, any>) => {
    const response = await lajiApi.post('/documents', document)
    return response.data
  },
  getFormPermissions: async () => {
    const response = await lajiApi.get('/form-permissions')
    return response.data
  },
  postImage: async (formDataBody: FormData) => {
    const response = await lajiApi.post('/images', formDataBody, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  postImageMetadata: async (tmpId: string, metadata: object) => {
    const response = await lajiApi.post('/images/' + tmpId, JSON.stringify(metadata), {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    })
    return response.data
  },
  postCoordinates: async (geometry: Point | LineString | MultiLineString) => {
    const response = await lajiApi.post('/coordinates/location', geometry, {
      headers: {
        'Accept': 'application/json'
      }
    })
    return response.data
  },
  postError: async (errorData: { message: string, meta: Record<string, any> }) => {
    const response = await lajiApi.post('/logger/error', errorData)
    return response
  },
  getAutocomplete: async (query: string, filters?: Record<string, any>, signal?: AbortSignal) => {
    const response = await lajiApi.get('/autocomplete/taxa', {
      headers: {
        'Accept': 'application/json',
        'API-Version': '1'
      },
      params: {
        query,
        limit: 5,
        matchType: 'exact,partial',
        nameTypes: '!MX.hasMisappliedName,!MX.hasMisspelledName,!MX.hasUncertainSynonym,!MX.hasOrthographicVariant',
        includeHidden: false,
        ...filters
      },
      signal: signal ? signal : undefined
    })
    return response.data
  },
  getNews: async (tag: string) => {
    const response = await lajiApi.get('/news', { params: { tag, page: 1 } })
    return response.data
  },
  getNamedPlaces: async (collectionID: string) => {
    const response = await lajiApi.get('/named-places', { params: { collectionID, includePublic: true, includeUnits: false, pageSize: 1000 } })
    return response.data
  },
  getLogin: async () => {
    const response = await lajiApi.get('/login')
    return response.data
  },
  postLoginCheck: async (tmpToken: string) => {
    const response = await lajiApi.post('/login/check', null, { params: { tmpToken } })
    return response.data
  },
  getPerson: async () => {
    const response = await lajiApi.get('/person')
    return response.data
  },
  getProfile: async () => {
    const response = await lajiApi.get('/person/profile')
    return response.data
  },
  getAuthenticationEvent: async () => {
    const response = await lajiApi.get('/authentication-event')
    return response.data
  },
  deleteAuthenticationEvent: async () => {
    await lajiApi.delete('/authentication-event')
  }
}

export default lajiApiService

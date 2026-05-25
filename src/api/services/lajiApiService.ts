import { lajiApi } from '../index'
import { LineString, MultiLineString, Point } from 'geojson'

const lajiApiService = {
  getForm: async (formId: string) => {
    const response = await lajiApi.get('/forms/' + formId)
    return response.data
  },
  getDocuments: async (personToken: string, selectedFields: string[], sourceID: string, pageSize: number) => {
    const response = await lajiApi.get('/documents', { params: { personToken, selectedFields, sourceID, pageSize } })
    return response.data.results
  },
  postDocument: async (document: Record<string, any>, personToken: string) => {
    const response = await lajiApi.post('/documents', document, { params: { personToken } })
    return response.data
  },
  getFormPermissions: async (personToken: string) => {
    const response = await lajiApi.get('/formPermissions', { params: { personToken } })
    return response.data
  },
  postImage: async (formDataBody: FormData, personToken: string) => {
    const response = await lajiApi.post('/images', formDataBody, {
      params: { personToken },
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  postImageMetadata: async (tempId: string, metadata: object, personToken: string) => {
    const response = await lajiApi.post('/images/' + tempId, JSON.stringify(metadata), {
      params: { personToken },
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    })
    return response.data
  },
  getLocality: async (geometry: Point | LineString | MultiLineString) => {
    const response = await lajiApi.post('/locality', geometry, {
      headers: {
        'Accept': 'application/json'
      }
    })
    return response.data
  }
}

export default lajiApiService

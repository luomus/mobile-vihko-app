import {
  userActionTypes,
  CLEAR_CREDENTIALS,
  SET_CREDENTIALS,
} from './types'

const initCredentials = {
  user: null,
  token: null
}

const credentialsReducer = (state = initCredentials, action: userActionTypes) => {
  switch (action.type) {
    case CLEAR_CREDENTIALS:
      return initCredentials
    case SET_CREDENTIALS:
      return action.payload
    default:
      return state
  }
}

export { credentialsReducer }
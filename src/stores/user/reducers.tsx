import {
  userActionTypes,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
} from './types'

const initCredentials = {
  user: null,
  token: null
}

const credentialsReducer = (state = initCredentials, action: userActionTypes) => {
  switch (action.type) {
    case SET_CREDENTIALS:
      return action.payload
    case CLEAR_CREDENTIALS:
      return initCredentials
    default:
      return state
  }
}

export { credentialsReducer }
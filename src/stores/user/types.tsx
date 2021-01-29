export const SET_CREDENTIALS = 'SET_CREDENTIALS'
export const CLEAR_CREDENTIALS = 'CLEAR_CREDENTIALS'

export interface CredentialsType {
  user: UserType | null,
  token: string | null,
}

export interface UserType {
  id: string,
  fullName: string,
  emailAddress: string,
  defaultLanguage: string,
}

interface clearCredentials {
  type: typeof CLEAR_CREDENTIALS,
}

interface setCredentials {
  type: typeof SET_CREDENTIALS,
  payload: CredentialsType,
}

export type userActionTypes =
  clearCredentials |
  setCredentials
export const SET_CREDENTIALS = 'SET_CREDENTIALS'
export const CLEAR_CREDENTIALS = 'CLEAR_CEDENTIALS'

export interface UserType {
  id: string,
  fullName: string,
  emailAddress: string,
  defaultLanguage: string,
}

export interface CredentialsType {
  user: UserType | null,
  token: string | null,
}

interface setCredentials {
  type: typeof SET_CREDENTIALS,
  payload: CredentialsType,
}

interface clearCredentials {
  type: typeof CLEAR_CREDENTIALS,
}

export type userActionTypes =
  setCredentials |
  clearCredentials
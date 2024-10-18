export interface CredentialsType {
  user: UserType | null,
  token: string | null,
  permissions?: Array<string>,
  metadata?: {
    capturerVerbatim: string,
    intellectualOwner: string,
    intellectualRights: string,
  }
}

export interface UserType {
  id: string,
  fullName: string,
  emailAddress: string,
  defaultLanguage: string,
}
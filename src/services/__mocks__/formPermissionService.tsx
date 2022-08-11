export const getFormPermissions = async (personToken: string): Promise<Record<string, any>> => {
  return {
      "admins": [],
      "editors": [
          "HR.2951",
      ],
      "permissionRequests": [],
      "personID": "MA.1",
  }
}
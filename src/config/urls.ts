//tokens
export const accessToken = 'OIL8AEzGrFMDvhUmOxzLlbZhW71VEFkQF739VdR1cZxiNNldURZo8leRx0uyKbPl'

//mapurl
export const mapUrl = 'https://proxy.laji.fi/mml_wmts/maasto/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png'
//graphql url
export const graphqlUrl           = 'https://apitest.laji.fi/v0/graphql'

//documents url
export const postDocumentUrl      = `https://apitest.laji.fi/v0/documents?personToken=$TOKEN&access_token=${accessToken}&validationErrorFormat=remote`

//image urls
export const postImageUrl         = `https://apitest.laji.fi/v0/images?personToken=$TOKEN&access_token=${accessToken}`
export const postImageMetadataUrl = `https://apitest.laji.fi/v0/images/$TEMPID?personToken=$TOKEN&access_token=${accessToken}`

//login urls
export const getLoginUrl          = `https://apitest.laji.fi/v0/login?access_token=${accessToken}`
export const pollLoginUrl         = `https://apitest.laji.fi/v0/login/check?tmpToken=$TEMPTOKEN&access_token=${accessToken}`
export const getUserUrl           = `https://apitest.laji.fi/v0/person/$TOKEN?access_token=${accessToken}`

//privacy policy
export const privacyPolicyEn      = 'https://laji.fi/about/848'
export const privacyPolicyFi      = 'https://laji.fi/about/713'

//laji.fi observations page
export const lajiFI = 'https://laji.fi/observation/list'
export const lajiSV = 'https://laji.fi/sv/observation/list'
export const lajiEN = 'https://laji.fi/en/observation/list'
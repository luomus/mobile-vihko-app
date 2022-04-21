//map url
export const mapUrl               = 'https://proxy.laji.fi/mml_wmts/maasto/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png'

//grid lines and labels url
export const gridUrl              = 'https://geoserver-dev.laji.fi/geoserver/LajiMapData/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=LajiMapData%3AatlasGridsWGS84&SRS=EPSG%3A3857&WIDTH={width}&HEIGHT={height}&BBOX={minX}%2C{minY}%2C{maxX}%2C{maxY}'

//prod api root url
const apiRoot                     = 'https://api.laji.fi/v0'

//dev api root url
// const apiRoot                     = 'https://apitest.laji.fi/v0'

//graphql url
export const graphqlUrl           = `${apiRoot}/graphql`

//documents url
export const postDocumentUrl      = `${apiRoot}/documents`

//image urls
export const postImageUrl         = `${apiRoot}/images`

//autocomplete url
export const autocompleteUrl      = `${apiRoot}/autocomplete/`

//locality url
export const localityUrl          = `${apiRoot}/coordinates/location`

//logger url
export const loggerUrl            = `${apiRoot}/logger/error`

//form permission url
export const formPermissionUrl    = `${apiRoot}/formPermissions`

//observation zone urls
export const getZonesUrl          = `${apiRoot}/named-places`

//login urls
export const getLoginUrl          = `${apiRoot}/login`
export const pollLoginUrl         = `${apiRoot}/login/check`
export const getUserUrl           = `${apiRoot}/person/`
export const personTokenUrl       = `${apiRoot}/person-token/`

//bird list url
export const birdListUrl          = 'https://atlas-api.rahtiapp.fi/api/v1/taxon'

//grid name url
export const gridNameUrl          = 'https://atlas-api.rahtiapp.fi/api/v1/grid/'

//laji.fi
export const lajiHomepageEn       = 'https://laji.fi/en'
export const lajiHomepageFi       = 'https://laji.fi'
export const lajiHomepageSv       = 'https://laji.fi/sv'

//instructions
export const instructionsEn       = 'https://laji.fi/en/about/4981'
export const instructionsFi       = 'https://laji.fi/about/4981'
export const instructionsSv       = 'https://laji.fi/sv/about/4981'

//privacy policy
export const privacyPolicyEn      = 'https://laji.fi/about/848'
export const privacyPolicyFi      = 'https://laji.fi/about/713'

//terms of service
export const termsOfServiceEn     = 'https://laji.fi/en/vihko/terms-of-service'
export const termsOfServiceFi     = 'https://laji.fi/vihko/terms-of-service'
export const termsOfServiceSv     = 'https://laji.fi/sv/vihko/terms-of-service'

//vihko
export const vihkoEn              = 'https://laji.fi/en/vihko'
export const vihkoFi              = 'https://laji.fi/vihko'
export const vihkoSv              = 'https://laji.fi/sv/vihko'

//lolife
export const lolifeEn             = 'https://laji.fi/en/project/MHL.45/about'
export const lolifeFi             = 'https://laji.fi/project/MHL.45/about'
export const lolifeSv             = 'https://laji.fi/sv/project/MHL.45/about'

//laji.fi observations page
export const lajiFI               = 'https://laji.fi/observation/list'
export const lajiSV               = 'https://laji.fi/sv/observation/list'
export const lajiEN               = 'https://laji.fi/en/observation/list'

//grid selection
export const gridPreview          = 'https://laji.fi/map?layers=maastokartta,atlasGrid&gridsquare='

//google geocoding api url
export const googleGeocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json'
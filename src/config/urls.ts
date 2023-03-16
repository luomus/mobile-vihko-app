import { API_URL, ATLAS_API_URL, LAJI_URL } from 'react-native-dotenv'

//map url
export const mapUrl               = 'https://proxy.laji.fi/mml_wmts/maasto/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png'

//grid lines and labels url
export const gridUrl              = 'https://geoserver-dev.laji.fi/geoserver/LajiMapData/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=LajiMapData%3AatlasGridsWGS84&SRS=EPSG%3A3857&WIDTH={width}&HEIGHT={height}&BBOX={minX}%2C{minY}%2C{maxX}%2C{maxY}'

//graphql url
export const graphqlUrl           = `${API_URL}/graphql`

//documents url
export const postDocumentUrl      = `${API_URL}/documents`

//sent documents url
export const sentDocumentsUrl     = `${API_URL}/warehouse/query/document/aggregate`

//image urls
export const postImageUrl         = `${API_URL}/images`

//autocomplete url
export const autocompleteUrl      = `${API_URL}/autocomplete/`

//locality url
export const localityUrl          = `${API_URL}/coordinates/location`

//logger url
export const loggerUrl            = `${API_URL}/logger/error`

//form permission url
export const formPermissionUrl    = `${API_URL}/formPermissions`

//observation zone urls
export const getZonesUrl          = `${API_URL}/named-places`

//login urls
export const getLoginUrl          = `${API_URL}/login`
export const pollLoginUrl         = `${API_URL}/login/check`
export const getUserUrl           = `${API_URL}/person/`
export const personTokenUrl       = `${API_URL}/person-token/`

//news url
export const getNewsUrl           = `${API_URL}/news`

//complete list url
export const completeListUrl      = `${ATLAS_API_URL}/taxon/biomon`

//grid name url
export const gridNameUrl          = `${ATLAS_API_URL}/grid/`

//grid preview url
export const gridPreviewUrl       = `${ATLAS_API_URL}/map?layers=maastokartta,atlasGrid&gridsquare=`

//result service url
export const resultServiceUrl     = 'https://tulokset.lintuatlas.fi/grid/'

//version number url
export const versionNumberUrl     = 'https://cdn.laji.fi/mobiilivihko/version.txt'

//play store url
export const playStoreUrl         = 'market://details?id=org.luomus.mobi'

//laji.fi
export const lajiHomepageEn       = `${LAJI_URL}/en`
export const lajiHomepageFi       =  LAJI_URL
export const lajiHomepageSv       = `${LAJI_URL}/sv`

//instructions
export const instructionsEn       = `${LAJI_URL}/en/about/4981`
export const instructionsFi       = `${LAJI_URL}/about/4981`
export const instructionsSv       = `${LAJI_URL}/sv/about/4981`

//privacy policy
export const privacyPolicyEn      = `${LAJI_URL}/about/848`
export const privacyPolicyFi      = `${LAJI_URL}/about/713`

//terms of service
export const termsOfServiceEn     = `${LAJI_URL}/en/vihko/terms-of-service`
export const termsOfServiceFi     = `${LAJI_URL}/vihko/terms-of-service`
export const termsOfServiceSv     = `${LAJI_URL}/sv/vihko/terms-of-service`

//vihko
export const vihkoEn              = `${LAJI_URL}/en/vihko`
export const vihkoFi              = `${LAJI_URL}/vihko`
export const vihkoSv              = `${LAJI_URL}/sv/vihko`

//lolife
export const lolifeEn             = `${LAJI_URL}/en/project/MHL.45/about`
export const lolifeFi             = `${LAJI_URL}/project/MHL.45/about`
export const lolifeSv             = `${LAJI_URL}/sv/project/MHL.45/about`

//laji.fi observations page
export const lajiFI               = `${LAJI_URL}/observation/list`
export const lajiSV               = `${LAJI_URL}/sv/observation/list`
export const lajiEN               = `${LAJI_URL}/en/observation/list`

//laji.fi news page
export const newsPage             = `${LAJI_URL}/news/`

//google geocoding api url
export const googleGeocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json'
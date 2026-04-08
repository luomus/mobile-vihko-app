import Config from './env'

//map url
export const mapUrl               = 'https://proxy.laji.fi/mml_wmts/maasto/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png'

//grid lines and labels url
export const gridUrl              = 'https://geoserver-dev.laji.fi/geoserver/LajiMapData/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=LajiMapData%3AatlasGridsWGS84&SRS=EPSG%3A3857&WIDTH={width}&HEIGHT={height}&BBOX={minX}%2C{minY}%2C{maxX}%2C{maxY}'

//forms url
export const formsUrl             = `${Config.API_URL}/forms`

//documents url
export const documentsUrl         = `${Config.API_URL}/documents`

//image urls
export const postImageUrl         = `${Config.API_URL}/images`

//autocomplete url
export const autocompleteUrl      = `${Config.API_URL}/autocomplete/`

//locality url
export const localityUrl          = `${Config.API_URL}/coordinates/location`

//logger url
export const loggerUrl            = `${Config.API_URL}/logger/error`

//form permission url
export const formPermissionUrl    = `${Config.API_URL}/formPermissions`

//observation zone urls
export const getZonesUrl          = `${Config.API_URL}/named-places`

//login urls
export const getLoginUrl          = `${Config.API_URL}/login`
export const pollLoginUrl         = `${Config.API_URL}/login/check`
export const getUserUrl           = `${Config.API_URL}/person/`
export const personTokenUrl       = `${Config.API_URL}/person-token`

//news url
export const getNewsUrl           = `${Config.API_URL}/news`

//complete list url
export const completeListUrl      = `${Config.ATLAS_API_URL}/taxon/biomon`

//grid name url
export const gridNameUrl          = `${Config.ATLAS_API_URL}/grid/`

//grid preview url
export const gridPreviewUrl       = `${Config.LAJI_URL}/map?layers=maastokartta,atlasGrid&gridsquare=`

//result service url
export const resultServiceUrl     = 'https://tulokset.lintuatlas.fi/grid/'

//version number url
export const versionNumberUrl     = 'https://cdn.laji.fi/mobiilivihko/version.txt'

//play store url
export const playStoreUrl         = 'market://details?id=org.luomus.mobi'

//app store url
export const appStoreUrl          = 'itms-apps://itunes.apple.com/app/1645835323'

//laji.fi
export const lajiHomepageEn       = `${Config.LAJI_URL}/en`
export const lajiHomepageFi       = `${Config.LAJI_URL}`
export const lajiHomepageSv       = `${Config.LAJI_URL}/sv`

//instructions
export const instructionsEn       = `${Config.LAJI_URL}/en/about/4981`
export const instructionsFi       = `${Config.LAJI_URL}/about/4981`
export const instructionsSv       = `${Config.LAJI_URL}/sv/about/4981`

//privacy policy
export const privacyPolicyEn      = `${Config.LAJI_URL}/about/848`
export const privacyPolicyFi      = `${Config.LAJI_URL}/about/713`

//terms of service
export const termsOfServiceEn     = `${Config.LAJI_URL}/en/vihko/terms-of-service`
export const termsOfServiceFi     = `${Config.LAJI_URL}/vihko/terms-of-service`
export const termsOfServiceSv     = `${Config.LAJI_URL}/sv/vihko/terms-of-service`

//vihko
export const vihkoEn              = `${Config.LAJI_URL}/en/vihko`
export const vihkoFi              = `${Config.LAJI_URL}/vihko`
export const vihkoSv              = `${Config.LAJI_URL}/sv/vihko`

//lolife
export const lolifeEn             = `${Config.LAJI_URL}/en/project/MHL.45/about`
export const lolifeFi             = `${Config.LAJI_URL}/project/MHL.45/about`
export const lolifeSv             = `${Config.LAJI_URL}/sv/project/MHL.45/about`

//laji.fi observations page
export const lajiFI               = `${Config.LAJI_URL}/observation/list`
export const lajiSV               = `${Config.LAJI_URL}/sv/observation/list`
export const lajiEN               = `${Config.LAJI_URL}/en/observation/list`

//laji.fi news page
export const newsPage             = `${Config.LAJI_URL}/news/`

//laji-auth account page
export const accountPageUrl       = `${Config.LAJI_AUTH_URL}/self`

//google geocoding api url
export const googleGeocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json'

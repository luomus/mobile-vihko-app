//task name for background location tracking
export const LOCATION_BACKGROUND_TASK = 'mobileVihkoBackgroundLocationHandler'

//gps-accuracy for location, scale 1-6 (5 highest GPS-based, 6 uses other sensors)
export const LOCATION_ACCURACY = 5

//location minimum intervall of update
export const LOCATION_MIN_T_INTERVALL = 500
export const LOCATION_MIN_X_INTERVALL = 5

//gps-accuracy for path updates, scale 1-6 (5 highest GPS-based, 6 uses other sensors)
export const PATH_ACCURACY = 5

//path minimum intervals of update
export const PATH_MIN_T_INTERVALL = 5000
export const PATH_MIN_X_INTERVALL = 30

//number of updates before path is added to observation event and saved to async
export const PATH_BACKUP_INTERVALL = 10

//boundaries of finland
export const FINLAND_BOUNDS = [[36.783, 71.348], [15.316, 56.311]]
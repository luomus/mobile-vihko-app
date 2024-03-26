//task name for background location tracking
export const LOCATION_BACKGROUND_TASK = 'mobileVihkoBackgroundLocationHandler'

//gps-accuracy for location, scale 1-6 (5 highest GPS-based, 6 uses other sensors)
export const LOCATION_ACCURACY = 5

//location minimum intervall of update
export const LOCATION_MIN_T_INTERVAL = 500
export const LOCATION_MIN_X_INTERVAL = 5

//gps-accuracy for path updates, scale 1-6 (5 highest GPS-based, 6 uses other sensors)
export const PATH_ACCURACY = 5

//path minimum intervals of update
export const PATH_MIN_T_INTERVAL = 500
export const PATH_MIN_X_INTERVAL = 30

//number of updates before path is added to observation event and saved to async
export const PATH_BACKUP_INTERVAL = 10

//boundaries of finland
export const FINLAND_BOUNDS = [[36.783, 71.348], [15.316, 56.311]]

//maximum velocity for the gps outlier filter in m/s
export const MAX_VEL = 33.33

//minumum accepted distance between path points in meters
export const MIN_DIST = 10

//maximum speed increase z-score/sigma for accepting a path point into the path
export const Z_SCORE = 1

//sample of path points used to spot outlier points
export const PATH_WINDOW_SIZE = 15

//distance from 10km ykj grid square edge where warning is triggered
export const GRID_EDGE_DISTANCE = 100
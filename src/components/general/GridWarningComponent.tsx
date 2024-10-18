import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { appendPath, DispatchType, LocationType, RootState, setOutsideBorders, setPath, setTracking } from '../../stores'
import Colors from '../../styles/Colors'
import storageService from '../../services/storageService'
import { getCurrentLocation } from '../../helpers/geolocationHelper'

const GridWarningComponent = () => {

  const grid = useSelector((state: RootState) => state.grid)
  const path = useSelector((state: RootState) => state.path)
  const tracking = useSelector((state: RootState) => state.tracking)

  const dispatch: DispatchType = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    if (grid?.outsideBorders === 'pending') {
      setTimeout(async () => {
        if (grid?.outsideBorders === 'pending') {
          dispatch(setOutsideBorders('true'))

          const location: LocationType = await getCurrentLocation(true)
          await dispatch(appendPath({ locations: [location] })).unwrap()

          dispatch(setTracking(false))
          await storageService.save('tracking', false)
        }
      }, 120000)

    } else if (grid?.outsideBorders === 'false') {
      const restartTracking = async () => {
        const newPath = path
        if (newPath) {
          newPath.push([])
          dispatch(setPath(newPath))
        }

        dispatch(setTracking(true))
        await storageService.save('tracking', true)
      }

      if (tracking === false) restartTracking()
    }
  }, [grid?.outsideBorders])

  if (grid?.outsideBorders === 'true') {
    return (
      <View>
        <View style={{ backgroundColor: Colors.warning4, padding: 5, minHeight: '20%', width: '100%' }}>
          <Text>{t('outside borders 1') + ' ' + grid?.n + ':' + grid?.e + ' ' + grid?.name + '. ' + t('outside borders 2')}</Text>
        </View>
      </View>
    )
  } else if (grid?.pauseGridCheck) {
    return (
      <View style={{ backgroundColor: Colors.warning4, padding: 5, minHeight: '20%', width: '100%' }}>
        <Text>{t('grid warning 1') + ' ' + grid?.n + ':' + grid?.e + ' ' + grid?.name + '. ' + t('grid warning 2')}</Text>
      </View>
    )
  } else {
    return <></>
  }
}

export default GridWarningComponent
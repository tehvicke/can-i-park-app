import React, { useEffect, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ui } from '../reducers/ui.js';
import { parking } from '../reducers/parking.js';

import moment from 'moment';

export const DrawFeature = ({ feature }) => {
  /* UI stuff */
  const isSelectedFeature =
    feature.id === useSelector(store => store.ui.selectedFeature.id);
  const width = useSelector(store => store.ui.feature.width);
  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);
  const unSelectedOpacity = useSelector(
    store => store.ui.feature.unSelectedOpacity,
  );
  const selectedOpacity = useSelector(
    store => store.ui.feature.selectedOpacity,
  );

  const usersTime = moment(useSelector(store => store.parking.user.time));

  const userVehicleType = useSelector(store => store.parking.user.vehicleType);

  const dispatch = useDispatch();

  let allowed;
  if (feature.properties.vehicle !== userVehicleType) {
    /* If the vehicle type is not the same then it's not valid (Car cannot park on MC parking. Current implementation does not support other vehicles than a car!*/
    allowed = false;
  } else if (
    moment(feature.properties.parkingAllowedTime.start) > usersTime ||
    moment(feature.properties.parkingAllowedTime.end) < usersTime
  ) {
    allowed = false;
  } else {
    allowed = true;
  }

  // console.log(
  //   `ID: ${feature.id}, Start: ${
  //     feature.properties.parkingAllowedTime.start
  //   }, Now: ${usersTime.format()}, End: ${
  //     feature.properties.parkingAllowedTime.end
  //   }, Start > Now: ${moment(feature.properties.parkingAllowedTime.start) >
  //     usersTime}, End < Now: ${moment(
  //     feature.properties.parkingAllowedTime.end,
  //   ) < usersTime}, Allowed: ${allowed}`,
  // );

  let color;
  let layerIndex;
  if (allowed) {
    color = allowedColor;
    layerIndex = 100;
  } else {
    color = unAllowedColor;
    layerIndex = 150;
    dispatch(parking.actions.setFeatureIsNotAllowed(feature));
  }

  const [opacity, setOpacity] = useState(unSelectedOpacity);

  useEffect(() => {
    if (isSelectedFeature) {
      setOpacity(selectedOpacity);
      dispatch(ui.actions.setSelectededAllowed(allowed));
    } else {
      setOpacity(unSelectedOpacity);
    }
  }, [isSelectedFeature]);

  return (
    <View>
      <MapboxGL.ShapeSource shape={feature} id={feature.id}>
        <MapboxGL.LineLayer
          id={`line_${feature.id}`}
          style={{
            lineColor: color,
            lineWidth: width,
            lineOpacity: opacity,
          }}
          layerIndex={layerIndex}
        />
      </MapboxGL.ShapeSource>
    </View>
  );
};

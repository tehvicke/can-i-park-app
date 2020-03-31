import React, { useEffect, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ui } from '../reducers/ui.js';

import moment from 'moment';

const testDate = moment();

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

  const userVehicleType = useSelector(store => store.parking.user.vehicleType);

  const dispatch = useDispatch();

  let allowed;
  if (feature.properties.vehicle !== userVehicleType) {
    /* If the vehicle type is not the same then it's not valid (Car cannot park on MC parking. Current implementation does not support other vehicles than a car!*/
    allowed = false;
  } else if (
    moment(feature.properties.parkingAllowedTime.start) > testDate ||
    moment(feature.properties.parkingAllowedTime.end) < testDate
  ) {
    allowed = false;
  } else {
    allowed = true;
  }
  console.log(
    'Start: ',
    feature.properties.parkingAllowedTime.start,
    ', Now: ',
    testDate.format(),
    ', End: ',
    feature.properties.parkingAllowedTime.end,
  );
  console.log(
    'Start < Now',
    moment(feature.properties.parkingAllowedTime.start) < testDate,
    ', End > Now',
    moment(feature.properties.parkingAllowedTime.end) > testDate,
  );

  console.log(allowed);

  let color;
  if (allowed) {
    color = allowedColor;
  } else {
    color = unAllowedColor;
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
        />
      </MapboxGL.ShapeSource>
    </View>
  );
};

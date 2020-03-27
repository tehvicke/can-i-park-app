import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { useSelector, useDispatch } from 'react-redux';
import { ui } from '../reducers/ui.js';

export const DrawFeature = ({ feature, visible, allowed }) => {
  const isSelectedFeature =
    feature.id === useSelector(store => store.ui.selectedFeature.id);

  const width = useSelector(store => store.ui.feature.width);

  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);

  const dispatch = useDispatch();

  const unSelectedOpacity = useSelector(
    store => store.ui.feature.unSelectedOpacity,
  );
  const selectedOpacity = useSelector(
    store => store.ui.feature.selectedOpacity,
  );

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

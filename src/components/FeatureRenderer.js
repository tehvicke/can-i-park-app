import React from 'react';
import { useSelector } from 'react-redux';
import { DrawFeature } from './DrawFeature.js';

export const FeatureRenderer = () => {
  const features = useSelector(store => store.parking.features);
  const minZoomLevelForFeatures = useSelector(
    store => store.ui.map.minZoomLevelForFeatures,
  );
  const zoomLevel = useSelector(store => store.ui.map.zoomLevel);

  return (
    zoomLevel >= minZoomLevelForFeatures &&
    features.map((feature, index) => {
      return <DrawFeature feature={feature} index={index} key={feature.id} />;
    })
  );
};

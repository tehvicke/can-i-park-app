import React from 'react';
import { useSelector } from 'react-redux';
import { DrawFeature } from './DrawFeature.js';

export const FeatureRenderer = () => {
  const features = useSelector(store => store.parking.features);

  return features.map((feature, index) => {
    return <DrawFeature feature={feature} index={index} key={feature.id} />;
  });
};

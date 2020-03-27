import React from 'react';
import { useSelector } from 'react-redux';
import { DrawFeature } from './DrawFeature.js';
import ParkingValidator from '../lib/ParkingValidator.js';

import moment from 'moment';

export const FeatureRenderer = () => {
  const features = useSelector(store => store.parking.features);

  console.log(moment('2020-03-18 12:01', 'YYYY-MM-DD HH:mm'));

  // const testDate = moment('2020-03-20 12:01', 'YYYY-MM-DD HH:mm');
  // const testDate = moment('2020-03-18 12:01', 'YYYY-MM-DD HH:mm');
  const testDate = moment();

  const validator = new ParkingValidator(features, testDate);

  const visibleFeatures = [];

  return features.map((feature, index) => {
    let visible;
    let allowed;

    if (!validator.featureIsActive(feature))
      return null; /* If feature is NOT active - then do not render it! */
    allowed = validator.parkingIsAllowed(feature);

    if (visibleFeatures.includes(feature.properties.FEATURE_OBJECT_ID)) {
      visible = false;
    } else {
      visible = true;
      visibleFeatures.push(feature.properties.FEATURE_OBJECT_ID);
    }
    return (
      <DrawFeature
        feature={feature}
        index={index}
        key={feature.id}
        visible={visible}
        allowed={allowed}
      />
    );
  });
};

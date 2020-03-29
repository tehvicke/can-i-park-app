import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { useSelector } from 'react-redux';

const originalIconSize = { x: 64, y: 98 }; /* x, y */
const scale = 0.5;
const iconSize = {
  x: originalIconSize.x * scale,
  y: originalIconSize.y * scale,
};

const markerUrls = {
  active: require('../../lib/icons/marker-blue.png'),
  nonActive: require('../../lib/icons/marker-gray.png'),
};

export const CenterIcon = () => {
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  return (
    <Image
      style={styles.marker}
      source={selectedFeatureId ? markerUrls.active : markerUrls.nonActive}
    />
  );
};

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: iconSize.x,
    height: iconSize.y,
    left: '50%',
    top: '50%',
    transform: [{ translateX: -(iconSize.x / 2) }, { translateY: -iconSize.y }],
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const originalIconSize = { x: 64, y: 98 }; /* x, y */
const scale = 0.5;
const iconSize = {
  x: originalIconSize.x * scale,
  y: originalIconSize.y * scale,
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

export const CenterIcon = () => {
  return (
    <Image
      style={styles.marker}
      source={require('../../lib/icons/64px-Map_marker.svg.png')}
    />
  );
};

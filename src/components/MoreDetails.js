import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

export const MoreDetails = () => {
  const allSelectedFeatures = useSelector(
    store => store.parking.allSelectedFeatures,
  );

  return (
    <View style={styles.moreDetails}>
      {allSelectedFeatures.map(feature => (
        <>
          <Text>{feature.properties.typeDesc}</Text>
          <Image source={require('../../lib/icons/moreinfo-arrow.png')} />
        </>
      ))}
    </View>
  );
};

const styles = {
  moreDetails: {
    width: '100%',
    // height: 60,
    backgroundColor: 'white',
  },
};

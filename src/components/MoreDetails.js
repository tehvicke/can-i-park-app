import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

const handlePress = async url => {
  console.log('pressed!');
  await Linking.openURL(url);
};

export const MoreDetails = () => {
  const allSelectedFeatures = useSelector(
    store => store.parking.allSelectedFeatures,
  );

  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);
  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  return (
    <View style={styles.moreDetails}>
      {allSelectedFeatures.map(feature => {
        const boxColor = feature.properties.allowed
          ? allowedColor
          : unAllowedColor;
        return (
          <View key={feature.properties.id} style={styles.featureWrapper}>
            <View
              style={StyleSheet.flatten([
                { backgroundColor: boxColor },
                styles.coloredBox,
              ])}
            />
            <View style={styles.textHolder}>
              <Text style={styles.featureText}>
                {feature.properties.address}
              </Text>
              <Text style={styles.featureTextBottom}>
                {feature.properties.typeDesc}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePress(feature.properties.url)}>
              <Image
                style={styles.pdfIcon}
                source={require('../../lib/icons/stockholm-stad-logo-skold.jpg')}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = {
  moreDetails: {
    width: '100%',
    backgroundColor: 'white',
  },
  featureWrapper: {
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#00559633',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textHolder: { width: '80%' },
  featureText: { fontWeight: '700' },
  featureTextBottom: {},
  coloredBox: {
    height: 20,
    width: 20,
  },
  pdfIcon: { resizeMode: 'contain', height: 30, width: 20 },
};

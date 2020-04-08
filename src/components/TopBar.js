import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import moment from 'moment';

/* Various constants that should be replaced / added to the global state */
const parkingText = {
  allowed: 'Gatuparkering tillåten',
  notAllowed: 'Gatuparkering ej tillåten',
};
const allowedTextColor = '#005596';
const notSelectedTextColor = '#777777';

const parkingUntilText = 'Fram till onsdag 13/4 kl 17.00';

const parkingAllowedUntil = feature => {
  // console.log(feature);
  if (feature.allowed) {
    console.log(feature.parkingAllowedTime);
  }
};

export const TopBar = () => {
  const userHoldsDown = useSelector(
    store => store.ui.interactions.userHoldsDown,
  );
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);
  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  const [parkingAllowedText, setParkingAllowedText] = useState('');
  const [parkingAllowedTextColor, setParkingAllowedTextColor] = useState(
    'white',
  );
  const [horizontalBarColor, setHorizontalBarColor] = useState('');

  const [parkingAddress, setParkingAddress] = useState('');

  const [description, setDescription] = useState(parkingUntilText);

  const selectedFeatureIsAllowed = useSelector(
    store => store.ui.selectedFeature.allowed,
  );
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  let animatedHolder;
  let addressBar;
  let horizontalColoredBar;

  const parkingTextStyle = styles.parkingAllowedText;
  const parkingTextCombined = StyleSheet.flatten([
    { color: parkingAllowedTextColor },
    parkingTextStyle,
  ]);

  const parkingUntilTextStyle = styles.parkingUntilText;
  const parkingUntilTextCombined = StyleSheet.flatten([
    { color: parkingAllowedTextColor },
    parkingUntilTextStyle,
  ]);

  const horizontalColoredBarStyle = styles.horizontalColoredBar;
  const horizontalColoredBarCombined = StyleSheet.flatten([
    { backgroundColor: horizontalBarColor },
    horizontalColoredBarStyle,
  ]);

  useEffect(() => {
    if (userHoldsDown) {
      animatedHolder.slideOutUp(slideDuration);
      if (selectedFeatureId) addressBar.slideOutUp(slideDuration);
    } else {
      animatedHolder.slideInDown(slideDuration);
      if (selectedFeatureId) addressBar.slideInDown(slideDuration);
    }
  }, [userHoldsDown]);

  useEffect(() => {
    if (!selectedFeatureId) {
      setParkingAllowedText('Information saknas');
      setParkingAllowedTextColor(notSelectedTextColor);
      setDescription('Ingen angivelse är vald');
      setHorizontalBarColor(`${notSelectedTextColor}bb`);

      return;
    }
    if (selectedFeatureIsAllowed) {
      setParkingAllowedText(parkingText.allowed);
      setParkingAllowedTextColor(allowedTextColor);
      setDescription(parkingUntilText);
      setHorizontalBarColor(allowedColor);
    } else {
      setParkingAllowedText(parkingText.notAllowed);
      setParkingAllowedTextColor(unAllowedColor);
      setDescription(parkingUntilText);
      setHorizontalBarColor(unAllowedColor);
    }
  }, [selectedFeatureId, selectedFeatureIsAllowed]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.properties) {
      setParkingAddress(selectedFeature.properties.address);
    } else {
      setParkingAddress('');
    }
  }, [selectedFeature]);

  return (
    <View style={styles.topBar}>
      <View style={styles.logoBar}>
        <Image
          style={styles.logo}
          source={require('../../lib/icons/CANiPARK-logo-1x.png')}
        />
        <Text style={styles.city}>Stockholm</Text>
      </View>
      <Animatable.View ref={c => (animatedHolder = c)}>
        <Animatable.View style={styles.statusBar}>
          <View>
            <View style={styles.textHolder}>
              <Text style={parkingTextCombined}>{parkingAllowedText}</Text>
              <Text style={parkingUntilTextCombined}>{description}</Text>
              {selectedFeatureId && (
                <View style={styles.showDetailsHolder}>
                  <Image />
                  <Text style={styles.showDetailsText}>Visa detaljer</Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={horizontalColoredBarCombined}
            ref={c => (horizontalColoredBar = c)}
          />
        </Animatable.View>
        {selectedFeatureId && (
          <Animatable.View
            style={styles.addressBar}
            ref={c => (addressBar = c)}>
            <Text style={styles.addressBarText}>{parkingAddress}</Text>
          </Animatable.View>
        )}
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  logoBar: {
    height: 80,
    paddingRight: 15,
    paddingLeft: 15,
    width: '100%',
    backgroundColor: '#0085FF',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    color: 'white',
  },
  logo: {
    width: 110,
    resizeMode: 'contain',
  },
  city: {
    color: 'white',
  },
  statusBar: {
    // backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
  },
  parkingSign: {
    width: 65,
    height: 65,
  },
  textHolder: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
    height: 70,
    width: '100%',
  },
  parkingAllowedText: {
    fontWeight: '700',
    fontSize: 22,
  },
  parkingUntilText: {},
  addressBar: {
    height: 30,
    backgroundColor: '#555555aa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBarText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  showDetailsText: {
    color: '#0085FF',
  },
  horizontalColoredBar: {
    height: 25,
    width: '100%',
  },
});

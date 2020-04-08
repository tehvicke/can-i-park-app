import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import moment from 'moment';
import 'moment/locale/sv';

import { MoreDetails } from './MoreDetails.js';

/* Various constants that should be replaced / added to the global state */
const parkingText = {
  allowed: 'Gatuparkering tillåten',
  notAllowed: 'Gatuparkering ej tillåten',
};
const allowedTextColor = '#005596';
const notSelectedTextColor = '#777777';

const parkingAllowedUntil = (feature, locale, usersTime) => {
  if (!feature || !feature.properties) return;

  moment.locale('sv');
  let time;
  if (
    feature.properties.allowed &&
    feature.properties.type == 'TIME_RESTRICTED'
  ) {
    time = moment(feature.properties.parkingAllowedTime.end);
  } else if (feature.properties.type == 'ALWAYS_RESTRICTED') {
    return feature.properties.typeDesc;
  } else {
    time = moment(feature.properties.parkingAllowedTime.start).add(7, 'd');
  }
  return `Fram tills ${time.calendar().toLowerCase()} (${time.fromNow()})`;
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
  const [parkingUntilText, setParkingUntilText] = useState('');

  const [showDetails, setShowDetails] = useState(false);

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
      setParkingUntilText('Ingen angivelse är vald');
      setHorizontalBarColor(`${notSelectedTextColor}bb`);

      return;
    }
    if (selectedFeatureIsAllowed) {
      setParkingAllowedText(parkingText.allowed);
      setParkingAllowedTextColor('#005596');
      setHorizontalBarColor(allowedColor);
    } else {
      setParkingAllowedText(parkingText.notAllowed);
      setParkingAllowedTextColor(unAllowedColor);
      setHorizontalBarColor(unAllowedColor);
    }
  }, [selectedFeatureId, selectedFeatureIsAllowed]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.properties) {
      setParkingUntilText(parkingAllowedUntil(selectedFeature, 'sv'));
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
              <Text style={parkingUntilTextCombined}>{parkingUntilText}</Text>
              {selectedFeatureId && (
                <View style={styles.showDetailsWrapper}>
                  <TouchableOpacity
                    style={styles.showDetailsHolder}
                    onPress={() => {
                      setShowDetails(!showDetails);
                    }}>
                    <Image
                      style={styles.showDetailsArrow}
                      source={require('../../lib/icons/moreinfo-arrow.png')}
                    />
                    <Text style={styles.showDetailsText}>Visa detaljer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {showDetails && <MoreDetails />}
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
  showDetailsWrapper: {
    width: '100%',
    display: 'flex',
    height: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  showDetailsHolder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  showDetailsArrow: {
    width: 12,
    resizeMode: 'contain',
    marginRight: 4,
    margin: 0,
    padding: 0,
  },
  showDetailsText: {
    color: '#0085FF',
    margin: 0,
    padding: 0,
  },
  horizontalColoredBar: {
    height: 25,
    width: '100%',
  },
});

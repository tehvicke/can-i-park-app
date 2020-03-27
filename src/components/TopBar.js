import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

/* Various constants that should be replaced / added to the global state */
const parkingText = {
  allowed: 'Parkering tillåten',
  notAllowed: 'Parkering ej tillåten',
};
const allowedTextColor = '#005596';

const parkingUntilText = 'Fram till onsdag 13/4 kl 17.00';

const parkingSigns = {
  allowed: require('../../lib/icons/e19-1.png'),
  notAllowed: require('../../lib/icons/c35-1.png'),
};

const parkingSignSelector = allowed => {
  if (allowed) {
    return parkingSigns.allowed;
  } else {
    return parkingSigns.notAllowed;
  }
};

export const TopBar = () => {
  const userHoldsDown = useSelector(
    store => store.ui.interactions.userHoldsDown,
  );
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  const [parkingAllowedText, setParkingAllowedText] = useState('');
  const [parkingAllowedTextColor, setParkingAllowedTextColor] = useState(
    'white',
  );
  const [parkingAddress, setParkingAddress] = useState('');

  const [description, setDescription] = useState(parkingUntilText);

  const selectedFeatureIsAllowed = useSelector(
    store => store.ui.selectedFeature.allowed,
  );
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  let animatedHolder;
  let addressBar;

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
      setParkingAllowedText('Missing data, check local signs');
      setParkingAllowedTextColor('gray');
      setDescription('Have you selected a feature?');

      return;
    }
    if (selectedFeatureIsAllowed) {
      setParkingAllowedText(parkingText.allowed);
      setParkingAllowedTextColor(allowedTextColor);
      setDescription(parkingUntilText);
    } else {
      setParkingAllowedText(parkingText.notAllowed);
      setParkingAllowedTextColor(unAllowedColor);
      setDescription(parkingUntilText);
    }
  }, [selectedFeatureId, selectedFeatureIsAllowed]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.properties) {
      setParkingAddress(selectedFeature.properties.ADDRESS);
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
          {selectedFeatureId && (
            <Image
              style={styles.parkingSign}
              source={parkingSignSelector(selectedFeatureIsAllowed)}
            />
          )}
          <View style={styles.textHolder}>
            <Text style={parkingTextCombined}>{parkingAllowedText}</Text>
            <Text style={parkingUntilTextCombined}>{description}</Text>
            {selectedFeatureId && (
              <View style={styles.showDetailsHolder}>
                <Image />
                <Text>Visa detaljer</Text>
              </View>
            )}
          </View>
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
    height: 100,
    width: '100%',
    // zIndex: 0,
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  parkingSign: {
    width: 65,
    height: 65,
  },
  textHolder: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start'
    paddingLeft: 10,
    height: '100%',
    marginTop: 10,
  },
  parkingAllowedText: {
    fontWeight: '700',
    fontSize: 20,
  },
  parkingUntilText: {
    marginTop: 5,
  },
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
});

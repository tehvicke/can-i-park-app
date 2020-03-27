import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

const parkingText = {
  allowed: 'Parkering tillåten',
  notAllowed: 'Parkering ej tillåten',
};
const allowedTextColor = '#005596';

const parkingUntilText = 'Fram till onsdag 13/4 kl 17.00';

const parkingSigns = {
  allowed: require('../../lib/icons/e19-1.png'), // statically analyzed
  notAllowed: require('../../lib/icons/c35-1.png'), // statically analyzed
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
  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  const [parkingAllowedText, setParkingAllowedText] = useState('');
  const [parkingAllowedTextColor, setParkingAllowedTextColor] = useState(
    'white',
  );

  const [description, setDescription] = useState('');

  const selectedFeatureIsAllowed = useSelector(
    store => store.ui.selectedFeature.allowed,
  );
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  let statusBar;

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
      statusBar.slideOutUp(slideDuration);
    } else {
      statusBar.slideInDown(slideDuration);
    }
  }, [userHoldsDown]);

  useEffect(() => {
    if (!selectedFeatureId) {
      setParkingAllowedText('Missing data, check local signs');
      setParkingAllowedTextColor('gray');

      return;
    }
    if (selectedFeatureIsAllowed) {
      setParkingAllowedText(parkingText.allowed);
      setParkingAllowedTextColor(allowedTextColor);
    } else {
      setParkingAllowedText(parkingText.notAllowed);
      setParkingAllowedTextColor(unAllowedColor);
    }
  }, [selectedFeatureId, selectedFeatureIsAllowed]);

  useEffect(() => {
    if (selectedFeature && selectedFeature.properties) {
      setDescription(selectedFeature.properties.OTHER_INFO);
    } else {
      setDescription('');
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

      <Animatable.View style={styles.statusBar} ref={c => (statusBar = c)}>
        {selectedFeatureId && (
          <Image
            style={styles.parkingSign}
            source={parkingSignSelector(selectedFeatureIsAllowed)}
          />
        )}
        <View style={styles.textHolder}>
          <Text style={parkingTextCombined}>{parkingAllowedText}</Text>
          <Text style={parkingUntilTextCombined}>{parkingUntilText}</Text>
          <View style={styles.showDetailsHolder}>
            <Image />
            <Text>Visa detaljer</Text>
          </View>
        </View>
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
    zIndex: 0,
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  coloredSquare: {
    width: 60,
    height: 60,
    display: 'none',
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
  description: {
    width: '100%',
    textAlign: 'center',
  },
});

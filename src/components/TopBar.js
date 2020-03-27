import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

export const TopBar = () => {
  const userHoldsDown = useSelector(
    store => store.ui.interactions.userHoldsDown,
  );
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);

  const allowedColor = useSelector(store => store.ui.feature.allowedColor);
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);

  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  const [description, setDescription] = useState('');

  const [color, setColor] = useState('white');
  const [parkingAllowedText, setParkingAllowedText] = useState('');

  const selectedFeatureIsAllowed = useSelector(
    store => store.ui.selectedFeature.allowed,
  );
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  let statusBar;

  const coloredSquare = styles.coloredSquare;

  const combinedStyles = StyleSheet.flatten([
    { backgroundColor: color },
    coloredSquare,
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
      setColor('white');
      return;
    }
    if (selectedFeatureIsAllowed) {
      setColor(allowedColor);
      setParkingAllowedText('Parkering tillåtet!');
    } else {
      setColor(unAllowedColor);
      setParkingAllowedText(`Parking ej tillåtet`);
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
        <View style={combinedStyles} />
        <View style={styles.textHolder}>
          <Text style={styles.parkingAllowedText}>{parkingAllowedText}</Text>
          {/* <Text style={styles.description}>{description}</Text> */}
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    height: 180,
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
    // marginLeft: 18,
  },
  city: {
    color: 'white',
  },
  statusBar: {
    height: '50%',
    width: '100%',
    zIndex: 0,
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  coloredSquare: {
    width: 50,
    height: 50,
    margin: 10,
  },
  textHolder: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  parkingAllowedText: {
    fontWeight: '700',
    fontSize: 16,
  },
  description: {
    width: '100%',
    textAlign: 'center',
  },
});

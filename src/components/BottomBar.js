import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 120,
    borderWidth: 0,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  description: {
    width: '100%',
    textAlign: 'center',
  },
  address: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export const BottomBar = () => {
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);

  const userHoldsDown = useSelector(
    store => store.ui.interactions.userHoldsDown,
  );

  let bottomBar;

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (selectedFeature && selectedFeature.properties) {
      setDescription(selectedFeature.properties.OTHER_INFO);
      setAddress(selectedFeature.properties.ADDRESS);
    } else {
      setDescription('');
      setAddress('');
    }
  }, [selectedFeature]);

  useEffect(() => {
    if (userHoldsDown) {
      bottomBar.slideOutDown(slideDuration);
    } else {
      bottomBar.slideInUp(slideDuration);
    }
  }, [userHoldsDown]);

  return (
    <Animatable.View style={styles.bottomBar} ref={c => (bottomBar = c)}>
      <Text style={styles.address}>{address}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animatable.View>
  );
};

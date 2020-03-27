import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

export const BottomBar = () => {
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);
  const selectedFeature = useSelector(store => store.parking.selectedFeature);
  const fetchingFeatures = useSelector(store => store.ui.api.fetchingFeatures);
  const fetchingFeaturesMessage = useSelector(
    store => store.ui.api.fetchingFeaturesMessage,
  );

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

  // useEffect(() => {
  //   if (userHoldsDown) {
  //     bottomBar.slideOutDown(slideDuration);
  //   } else {
  //     bottomBar.slideInUp(slideDuration);
  //   }
  // }, [userHoldsDown]);

  useEffect(() => {
    if (!fetchingFeatures) {
      bottomBar.slideOutDown(slideDuration);
    } else {
      bottomBar.slideInUp(slideDuration);
    }
  }, [fetchingFeatures]);

  return (
    <Animatable.View style={styles.bottomBar} ref={c => (bottomBar = c)}>
      <View style={styles.loadingIndicatorHolder}>
        <Text style={styles.loadingIndicatorText}>
          {fetchingFeaturesMessage}
        </Text>
      </View>

      <Text style={styles.address}>{address}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    borderWidth: 0,

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
  loadingIndicatorHolder: {
    backgroundColor: '#555555aa',
    // width: '80%',
    padding: 5,
    borderRadius: 5,
  },
  loadingIndicatorText: {
    color: 'white',
    textAlign: 'center',
  },
});

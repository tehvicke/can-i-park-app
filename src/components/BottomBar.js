import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

const notSelectedTextColor = '#777777';

export const BottomBar = () => {
  const userHoldsDown = useSelector(
    store => store.ui.interactions.userHoldsDown,
  );
  const slideDuration = useSelector(store => store.ui.animations.slideDuration);
  const fetchingFeatures = useSelector(store => store.ui.api.fetchingFeatures);
  const fetchingFeaturesMessage = useSelector(
    store => store.ui.api.fetchingFeaturesMessage,
  );
  const unAllowedColor = useSelector(store => store.ui.feature.unAllowedColor);

  const selectedFeatureIsAllowed = useSelector(
    store => store.ui.selectedFeature.allowed,
  );
  const selectedFeatureId = useSelector(store => store.ui.selectedFeature.id);

  let horizontalColoredBarBottom;
  let loadingIndicatorHolder;

  const [horizontalBarBottomColor, setHorizontalBarBottomColor] = useState('');
  const horizontalColoredBarBottomStyle = styles.horizontalColoredBarBottom;
  const horizontalColoredBarBottomCombined = StyleSheet.flatten([
    { backgroundColor: horizontalBarBottomColor },
    horizontalColoredBarBottomStyle,
  ]);

  useEffect(() => {
    if (userHoldsDown) {
      horizontalColoredBarBottom.slideOutDown(slideDuration);
    } else {
      horizontalColoredBarBottom.slideInUp(slideDuration);
    }
  }, [userHoldsDown]);

  useEffect(() => {
    if (!selectedFeatureId) {
      setHorizontalBarBottomColor(`${notSelectedTextColor}bb`);
      return;
    }
    if (selectedFeatureIsAllowed) {
      setHorizontalBarBottomColor('#0085FF');
    } else {
      setHorizontalBarBottomColor(unAllowedColor);
    }
  }, [selectedFeatureId, selectedFeatureIsAllowed]);

  useEffect(() => {
    if (!fetchingFeatures) {
      loadingIndicatorHolder.slideOutDown(slideDuration);
    } else {
      loadingIndicatorHolder.slideInUp(slideDuration);
    }
  }, [fetchingFeatures]);

  return (
    <View style={styles.bottomBar}>
      <Animatable.View
        style={styles.loadingIndicatorHolder}
        ref={c => (loadingIndicatorHolder = c)}>
        <Text style={styles.loadingIndicatorText}>
          {fetchingFeaturesMessage}
        </Text>
      </Animatable.View>
      <Animatable.View
        style={horizontalColoredBarBottomCombined}
        ref={c => (horizontalColoredBarBottom = c)}></Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingIndicatorHolder: {
    backgroundColor: '#555555aa',
    // width: '80%',
    padding: 5,
    // marginBottom: 100,
  },
  loadingIndicatorText: {
    color: 'white',
    textAlign: 'center',
  },
  horizontalColoredBarBottom: {
    height: 35,
    width: '100%',
  },
});

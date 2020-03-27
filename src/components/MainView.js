import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ui } from '../reducers/ui.js';

/* Custom components */
import { MapBackground } from './MapBackground.js';
import { TopBar } from './TopBar.js';
import { BottomBar } from './BottomBar.js';
import { CenterIcon } from './CenterIcon.js';
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor:
      '#F5FCFF' /* Color if mapbox connection is not established */,
  },
  touchable: {
    flex: 1,
  },
});

const handleOnPressIn = dispatch => {
  dispatch(ui.actions.setUserHoldsDown(true));
};
const handleOnPressOut = dispatch => {
  // dispatch(ui.actions.setUserHoldsDown(false));
};
export const MainView = () => {
  dispatch = useDispatch();

  return (
    <View style={styles.page}>
      <TouchableOpacity
        // onPressIn={() => handleOnPressIn(dispatch)}
        // onPressOut={() => handleOnPressOut(dispatch)}
        style={styles.touchable}
        activeOpacity={1}>
        <MapBackground />
      </TouchableOpacity>
      <TopBar />
      <CenterIcon />
      <BottomBar />
    </View>
  );
};

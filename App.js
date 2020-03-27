import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import SplashScreen from 'react-native-splash-screen';

import { MainView } from './src/components/MainView.js';
import { parking } from './src/reducers/parking.js';
import { ui } from './src/reducers/ui.js';

const reducer = combineReducers({
  parking: parking.reducer,
  ui: ui.reducer,
});

const store = configureStore({ reducer });

export const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <MainView />
    </Provider>
  );
};

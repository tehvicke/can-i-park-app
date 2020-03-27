import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { ui } from './ui.js';

import data from '../testdata.json';

export const parking = createSlice({
  name: 'parking',
  initialState: {
    serverInfo: {
      url:
        'https://can-i-park-here-server.herokuapp.com/' /* http://localhost:8080/ https://can-i-park-here-server.herokuapp.com/ */,
      radius: 100,
    },
    position: undefined,
    shouldFetchFeatures: false,
    features: [],
    selectedFeature: {},
  },
  reducers: {
    updatePosition: (state, action) => {
      state.position = action.payload;
    },
    updateFeatures: (state, action) => {
      action.payload.features.map(newFeature => {
        let featureExists = false;
        state.features.map(existingFeature => {
          if (newFeature.id === existingFeature.id) {
            featureExists = true;
            return;
          }
        });
        if (!featureExists) state.features.push(newFeature);
      });
      // console.log(state.features);
    },
    setShouldFetchFeatures: state => {
      state.shouldFetchFeatures = !state.shouldFetchFeatures;
    },
    setSelectedFeature: (state, action) => {
      state.selectedFeature = action.payload;
    },
  },
});

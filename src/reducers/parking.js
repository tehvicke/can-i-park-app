import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const parking = createSlice({
  name: 'parking',
  initialState: {
    serverInfo: {
      url:
        // 'https://can-i-park-here-server.herokuapp.com/api/v2/' /* http://192.168.1.108:8080/ http://localhost:8080/ https://can-i-park-here-server.herokuapp.com/ */,
        'http://192.168.1.108:8080/api/v2/',
      radius: 100,
    },
    user: {
      vehicleType: 'CAR',
      time: moment().format(),
      // time: moment('2020-04-08T12:00:00+02:00').format(),
      locale: 'sv',
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
      action.payload.map(newFeature => {
        let featureExists = false;

        newFeature.properties.allowed = true;
        // console.log(newFeature);

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
    setFeatureIsNotAllowed: (state, action) => {
      state.features.find(feature => {
        if (action.payload.id === feature.id) {
          feature.properties.allowed = false;
        }
      });
    },
    setAllSelectedFeatures: (state, action) => {
      state.allSelectedFeatures = action.payload;
    },
  },
});

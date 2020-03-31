import { createSlice } from '@reduxjs/toolkit';

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
      console.log();
      action.payload.map(newFeature => {
        let featureExists = false;

        console.log(newFeature);

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

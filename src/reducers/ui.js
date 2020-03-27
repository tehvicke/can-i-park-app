import { createSlice } from '@reduxjs/toolkit';

export const ui = createSlice({
  name: 'ui',
  initialState: {
    selectedFeature: { id: undefined, shouldUpdate: false, allowed: false },
    map: { zoomLevel: 16, minZoomLevel: 14, maxZoomLevel: 18 },
    api: {
      fetchingFeatures: false,
      fetchingFeaturesMessage: '',
    },
    feature: {
      width: 15,
      allowedColor: '#05EA00',
      unAllowedColor: '#EE3A42',
      selectedOpacity: 1,
      unSelectedOpacity: 0.3,
    },
    animations: {
      slideDuration: 300,
    },
    interactions: {
      userHoldsDown: false,
    },
  },
  reducers: {
    setSelectedFeatureId: (state, action) => {
      state.selectedFeature.id = action.payload;
      console.log('Selected feature ID: ', action.payload);
    },
    setShouldUpdateSelectedFeature: state => {
      state.selectedFeature.shouldUpdate = !state.selectedFeature.shouldUpdate;
      // console.log('ShouldUpdate');
    },
    updateFeatureWidth: state => {
      const discrete = 0;
      const multiplier = 16;
      state.feature.width = discrete + (state.map.zoomLevel - 15) * multiplier;
      // console.log('Feature width', state.feature.width);
    },
    setZoomLevel: (state, action) => {
      state.map.zoomLevel = action.payload;
      // console.log('Zoom level: ', state.map.zoomLevel);
    },
    setUserHoldsDown: (state, action) => {
      state.interactions.userHoldsDown = action.payload;
      console.log('User holds down: ', state.interactions.userHoldsDown);
    },
    setSelectededAllowed: (state, action) => {
      state.selectedFeature.allowed = action.payload;
    },
    setFetchingFeatures: (state, action) => {
      state.api.fetchingFeatures = action.payload;
    },
    setFetchingFeaturesMessage: (state, action) => {
      state.api.fetchingFeaturesMessage = action.payload;
    },
  },
});

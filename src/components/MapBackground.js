import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import axios from 'axios';
import { parking } from '../reducers/parking.js';
import { ui } from '../reducers/ui.js';
import { FeatureRenderer } from './FeatureRenderer.js';

import { MAPBOX_API_KEY } from 'react-native-dotenv';

const minDistanceForFetch = 25;

MapboxGL.setAccessToken(MAPBOX_API_KEY);

const text = {
  fetchingData: 'Hämtar ny data...',
  fetchFailed: 'Hämtning av data misslyckades',
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const handleOnRegionDidChange = async (map, position, dispatch) => {
  dispatch(ui.actions.setUserHoldsDown(false));
  dispatch(ui.actions.setShouldUpdateSelectedFeature());

  const zoom = await map.current.getZoom();
  dispatch(ui.actions.setZoomLevel(zoom));
  dispatch(ui.actions.updateFeatureWidth());

  const newPos = await map.current.getCenter();
  dispatch(parking.actions.updatePosition(newPos));

  if (getDistance(newPos, position) > minDistanceForFetch)
    /* TODO: Fix this calculation as it's very irrational now... (due to multiple pos update) */
    dispatch(parking.actions.setShouldFetchFeatures());
};

const handleOnRegionWillChange = dispatch => {
  dispatch(ui.actions.setUserHoldsDown(true));
  dispatch(ui.actions.setShowDetails(false));
};

const handleOnDidFinishRenderingMapFully = async (
  map,
  camera,
  position,
  zoomLevel,
) => {
  await console.log('map: ', map.current);
  await console.log('camera: ', camera.current);
  await camera.current.flyTo(position);
  await camera.current.moveTo(zoomLevel);
};

export const MapBackground = () => {
  const dispatch = useDispatch();

  const position = useSelector(store => store.parking.position);
  const zoomLevel = useSelector(store => store.ui.map.zoomLevel);
  const radius = useSelector(store => store.parking.serverInfo.radius);
  const serverUrl = useSelector(store => store.parking.serverInfo.url);
  const timeNow = useSelector(store => store.parking.user.time);

  const shouldUpdateSelectedFeature = useSelector(
    store => store.ui.selectedFeature.shouldUpdate,
  );
  const shouldFetchFeatures = useSelector(
    store => store.parking.shouldFetchFeatures,
  );

  let map = useRef();
  let camera = useRef();

  /* Center to users location on load */

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
    let coords;
    Geolocation.getCurrentPosition(
      pos => {
        coords = [pos.coords.longitude, pos.coords.latitude];

        dispatch(parking.actions.updatePosition(coords));
        dispatch(parking.actions.setShouldFetchFeatures());
      },
      error => console.log(error.code, error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  /* Feature fetch functionality */
  useEffect(() => {
    if (position === undefined) {
      return;
    }
    console.log('Starting fetch for ', position);
    dispatch(ui.actions.setFetchingFeatures(true));
    dispatch(ui.actions.setFetchingFeaturesMessage(text.fetchingData));

    axios
      .get(
        `${serverUrl}?lat=${position[1]}&long=${
          position[0]
        }&radius=${radius}&time=${encodeURIComponent(timeNow)}`,
      )
      .then(response => {
        dispatch(parking.actions.updateFeatures(response.data));

        console.log('Fetch successful for ', position);
        dispatch(ui.actions.setFetchingFeatures(false));
        dispatch(ui.actions.setShouldUpdateSelectedFeature());
        return response;
      })
      .catch(error => {
        console.log(error);
        dispatch(ui.actions.setFetchingFeaturesMessage(text.fetchFailed));
      });
  }, [shouldFetchFeatures]);

  /* Feature selection */
  useEffect(() => {
    const updateSelectedFeature = async map => {
      const currentPosition = await map.current.getCenter();
      const pointFromCoords = await map.current.getPointInView(currentPosition);
      const featuresAtPosition = await map.current.queryRenderedFeaturesAtPoint(
        pointFromCoords,
      );

      const relevantFeaturesAtPosition = featuresAtPosition.features.filter(
        feature => {
          return (
            typeof feature.id === 'string' &&
            feature.id.startsWith('LTFR_P_TILLATEN')
          );
        },
      );
      if (relevantFeaturesAtPosition.length === 0) {
        dispatch(ui.actions.setSelectedFeatureId(undefined));
        dispatch(parking.actions.setSelectedFeature({}));
        return;
      }
      let selectedFeatureCandidate = relevantFeaturesAtPosition[0];
      relevantFeaturesAtPosition.forEach(feature => {
        if (!feature.properties.allowed) {
          selectedFeatureCandidate = feature;
        }
      });
      dispatch(ui.actions.setSelectedFeatureId(selectedFeatureCandidate.id));
      dispatch(parking.actions.setSelectedFeature(selectedFeatureCandidate));
      dispatch(
        parking.actions.setAllSelectedFeatures(relevantFeaturesAtPosition),
      );
    };
    updateSelectedFeature(map);
  }, [shouldUpdateSelectedFeature]);

  return (
    <MapboxGL.MapView
      ref={c => (map.current = c)}
      style={styles.map}
      onRegionWillChange={() => handleOnRegionWillChange(dispatch)}
      onRegionDidChange={() => handleOnRegionDidChange(map, position, dispatch)}
      onDidFinishRenderingMapFully={() =>
        handleOnDidFinishRenderingMapFully(map, camera, position, zoomLevel)
      }>
      <MapboxGL.Camera
        ref={c => (camera.current = c)}
        defaultSettings={{ zoomLevel: zoomLevel }}
        animationDuration={0}
        maxZoomLevel={18}
      />
      <FeatureRenderer />
      <MapboxGL.UserLocation animated={true} />
    </MapboxGL.MapView>
  );
};

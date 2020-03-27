import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import axios from 'axios';
import { parking } from '../reducers/parking.js';
import { ui } from '../reducers/ui.js';
import { FeatureRenderer } from './FeatureRenderer.js';

import { MAPBOX_API_KEY } from 'react-native-dotenv';

const minDistanceForFetch = 25;

/* Use default public token only - so OK to include here I guess... */
MapboxGL.setAccessToken(MAPBOX_API_KEY);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const handleOnRegionDidChange = async (map, position, dispatch) => {
  dispatch(ui.actions.setUserHoldsDown(false));
  dispatch(ui.actions.setShouldUpdateSelectedFeature());

  const zoom = await map.getZoom();
  dispatch(ui.actions.setZoomLevel(zoom));
  dispatch(ui.actions.updateFeatureWidth());

  const newPos = await map.getCenter();
  dispatch(parking.actions.updatePosition(newPos));

  // if (getDistance(newPos, position) > minDistanceForFetch) /* TODO: Fix this calculation as it's very irrational now... (due to multiple pos update) */
  dispatch(parking.actions.setShouldFetchFeatures());
};

const handleOnRegionWillChange = dispatch => {
  dispatch(ui.actions.setUserHoldsDown(true));
};

const handleOnDidFinishRenderingFrame = async (map, dispatch) => {
  // console.log('handleOnDidFinishRenderingFrame');
  // console.log('handleOnDidFinishRenderingFrameFully');
  // const newPos = await map.getCenter();
  // dispatch(parking.actions.updatePosition(newPos));
};

const handleOnDidFinishRenderingFrameFully = async (map, dispatch) => {};

export const MapBackground = () => {
  const dispatch = useDispatch();

  const position = useSelector(store => store.parking.position);
  const zoomLevel = useSelector(store => store.ui.map.zoomLevel);
  const radius = useSelector(store => store.parking.serverInfo.radius);
  const serverUrl = useSelector(store => store.parking.serverInfo.url);

  const shouldUpdateSelectedFeature = useSelector(
    store => store.ui.selectedFeature.shouldUpdate,
  );
  const shouldFetchFeatures = useSelector(
    store => store.parking.shouldFetchFeatures,
  );

  let map;

  /* On load stuff */
  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);

    Geolocation.getCurrentPosition(
      pos => {
        const coords = [pos.coords.longitude, pos.coords.latitude];

        dispatch(parking.actions.updatePosition(coords));
        dispatch(parking.actions.setShouldFetchFeatures());
      },
      error => console.log(error.code, error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  /* Function to fetch features */
  useEffect(() => {
    if (position === undefined) {
      return;
    }
    console.log('Starting fetch for ', position);
    dispatch(ui.actions.setFetchingFeatures(true));
    dispatch(
      ui.actions.setFetchingFeaturesMessage('Fetching street data from API'),
    );

    axios
      .get(
        `${serverUrl}?lat=${position[1]}&long=${position[0]}&radius=${radius}`,
      )
      .then(response => {
        dispatch(parking.actions.updateFeatures(response.data, dispatch));

        console.log('Fetch successful for ', position);
        dispatch(ui.actions.setFetchingFeatures(false));
        dispatch(ui.actions.setShouldUpdateSelectedFeature());
        return response;
      })
      .catch(error => {
        console.log(error);
        dispatch(
          ui.actions.setFetchingFeaturesMessage(
            'Fetch failed due to API not responding',
          ),
        );
      });
  }, [shouldFetchFeatures]);

  useEffect(() => {
    const updateSelectedFeature = async map => {
      const position = await map.getCenter();
      const pointFromCoords = await map.getPointInView(position);
      const featuresAtPosition = await map.queryRenderedFeaturesAtPoint(
        pointFromCoords,
      );

      // if (featuresAtPosition.features.length === 0) return;
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
      relevantFeaturesAtPosition.forEach(feature => {
        dispatch(ui.actions.setSelectedFeatureId(feature.id));
        dispatch(parking.actions.setSelectedFeature(feature));

        console.log(feature.properties);
        return;
      });
    };
    updateSelectedFeature(map);
  }, [shouldUpdateSelectedFeature]);

  return (
    <MapboxGL.MapView
      ref={c => (map = c)}
      style={styles.map}
      onRegionWillChange={() => handleOnRegionWillChange(dispatch)}
      onRegionDidChange={() => handleOnRegionDidChange(map, position, dispatch)}
      onDidFinishRenderingFrame={() =>
        handleOnDidFinishRenderingFrame(map, dispatch)
      }
      onDidFinishRenderingFrameFully={() => {
        handleOnDidFinishRenderingFrameFully(map, dispatch);
      }}>
      <MapboxGL.Camera
        zoomLevel={zoomLevel}
        centerCoordinate={position}
        animationDuration={0}
      />
      <MapboxGL.UserLocation animated={true} />
      <FeatureRenderer />
    </MapboxGL.MapView>
  );
};

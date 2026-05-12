import React, { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { campusCatalog } from '../data/cebuCampuses';

const defaultCenter = [10.3157, 123.8854];
const baseMapStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const CebuMap = ({ listings = [], hotspots = [], center = defaultCenter, zoom = 12, className = '' }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const listingFeaturesRef = useRef([]);
  const hotspotFeaturesRef = useRef([]);

  const listingFeatures = useMemo(
    () =>
      listings
        .filter((listing) => listing.latitude != null && listing.longitude != null)
        .map((listing) => ({
          type: 'Feature',
          properties: {
            id: listing.id,
            title: listing.title,
            university: listing.university,
            price: listing.price
          },
          geometry: {
            type: 'Point',
            coordinates: [Number(listing.longitude), Number(listing.latitude)]
          }
        })),
    [listings]
  );

  const hotspotFeatures = useMemo(
    () =>
      hotspots
        .filter((hotspot) => hotspot.latitude != null && hotspot.longitude != null)
        .map((hotspot) => ({
          type: 'Feature',
          properties: {
            name: hotspot.name,
            count: hotspot.count
          },
          geometry: {
            type: 'Point',
            coordinates: [Number(hotspot.longitude), Number(hotspot.latitude)]
          }
        })),
    [hotspots]
  );

  listingFeaturesRef.current = listingFeatures;
  hotspotFeaturesRef.current = hotspotFeatures;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseMapStyle,
      center: [center[1], center[0]],
      zoom,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      map.addSource('hotspots', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: hotspotFeaturesRef.current }
      });

      map.addLayer({
        id: 'hotspots-glow',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-color': '#2e8be8',
          'circle-opacity': 0.14,
          'circle-radius': ['+', 18, ['min', ['*', ['coalesce', ['get', 'count'], 0], 2], 18]]
        }
      });

      map.addLayer({
        id: 'hotspots-core',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-color': '#2e8be8',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
          'circle-radius': ['+', 6, ['min', ['*', ['coalesce', ['get', 'count'], 0], 1.1], 10]]
        }
      });

      map.addSource('listings', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: listingFeaturesRef.current }
      });

      map.addLayer({
        id: 'listings-points',
        type: 'circle',
        source: 'listings',
        paint: {
          'circle-color': '#131418',
          'circle-radius': 5.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5
        }
      });



      map.on('click', 'hotspots-core', (event) => {
        const feature = event.features?.[0];
        if (!feature) {
          return;
        }

        const [lng, lat] = feature.geometry.coordinates;
        const count = Number(feature.properties?.count || 0);
        const name = escapeHtml(feature.properties?.name || 'Hotspot');
        new maplibregl.Popup({ offset: 10, closeButton: false })
          .setLngLat([lng, lat])
          .setHTML(`<strong>${name}</strong><br/>${count} active listing${count === 1 ? '' : 's'}`)
          .addTo(map);
      });

      map.on('click', 'listings-points', (event) => {
        const feature = event.features?.[0];
        if (!feature) {
          return;
        }

        const [lng, lat] = feature.geometry.coordinates;
        const title = escapeHtml(feature.properties?.title || 'Listing');
        const university = escapeHtml(feature.properties?.university || 'Unknown university');
        const price = Number(feature.properties?.price || 0).toLocaleString();

        new maplibregl.Popup({ offset: 10 })
          .setLngLat([lng, lat])
          .setHTML(`<strong>${title}</strong><br/>${university}<br/>PHP ${price}`)
          .addTo(map);
      });

      map.on('mouseenter', 'hotspots-core', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'hotspots-core', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'listings-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'listings-points', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) {
      return;
    }

    const listingSource = map.getSource('listings');
    if (listingSource?.setData) {
      listingSource.setData({ type: 'FeatureCollection', features: listingFeatures });
    }

    const hotspotSource = map.getSource('hotspots');
    if (hotspotSource?.setData) {
      hotspotSource.setData({ type: 'FeatureCollection', features: hotspotFeatures });
    }

    const allFeatures = [...listingFeatures, ...hotspotFeatures];
    if (allFeatures.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      allFeatures.forEach((feature) => {
        bounds.extend(feature.geometry.coordinates);
      });
      map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 700 });
    }
  }, [listingFeatures, hotspotFeatures]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.easeTo({ center: [center[1], center[0]], zoom, duration: 650 });
  }, [center, zoom]);

  return <div ref={containerRef} className={`cebu-map ${className}`.trim()} />;
};

export default CebuMap;

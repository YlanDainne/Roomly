import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const defaultCenter = [10.3157, 123.8854]; // Cebu City center
const baseMapStyle = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const LocationPickerMap = ({ latitude, longitude, onLocationSelect, readOnly = false }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter = (latitude && longitude) 
      ? [Number(longitude), Number(latitude)] 
      : [defaultCenter[1], defaultCenter[0]];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseMapStyle,
      center: initialCenter,
      zoom: 13,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      // Create initial marker if we have coordinates
      if (latitude && longitude) {
        markerRef.current = new maplibregl.Marker({ color: '#2e8be8' })
          .setLngLat([Number(longitude), Number(latitude)])
          .addTo(map);
      }
    });

    map.on('click', (e) => {
      if (readOnly) return;
      
      const { lng, lat } = e.lngLat;
      
      // Update or create marker
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: '#2e8be8' })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }

      // Notify parent
      if (onLocationSelect) {
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    });

    if (!readOnly) {
      map.on('mouseenter', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Empty dependency array, only init once

  // Update map and marker if props change externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    if (latitude && longitude) {
      const newLngLat = [Number(longitude), Number(latitude)];
      markerRef.current.setLngLat(newLngLat);
      mapRef.current.flyTo({ center: newLngLat, zoom: 15 });
    }
  }, [latitude, longitude]);

  return (
    <div className="location-picker-wrapper" style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d5d5d8' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LocationPickerMap;

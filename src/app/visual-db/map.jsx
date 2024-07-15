"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Map({ onMapLoad }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/light-v9",
        center: [-114.063775, 51.0475053],
        zoom: 16,
        antialias: true,
        pitch: 60,
        bearing: 120,
      });

      map.on('style.load', () => {
        if (onMapLoad) onMapLoad(map);
      });

      return () => {
        map.remove();
      }
    }
  }, [onMapLoad]);

  return <div>map</div>;
}

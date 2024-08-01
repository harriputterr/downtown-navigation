"use client"
import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import Algolia from './AlgoliaFinal'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function Page() {
  const mapboxRef = useRef(null);

  useEffect(() => {
    if (mapboxRef.current) {
      const map = new mapboxgl.Map({
        container: mapboxRef.current,
        style: "mapbox://styles/mapbox/light-v9",
        center: [-114.063775, 51.0475053],
        zoom: 16,
        antialias: true,
      });

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
          showAccuracyCircle: false
    });

    map.addControl(geolocate);

      return () => {
        map.remove(); // Clean up on unmount
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (

    // <Algolia />
    <div ref={mapboxRef} className='w-screen h-screen'></div>
  )
}

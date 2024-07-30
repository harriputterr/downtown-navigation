"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Ensure the access token is set
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function page() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-114.063775, 51.0475053],
        zoom: 16,
        antialias: true,
      });

      // Debugging statements
      console.log("Mapbox GL JS version:", mapboxgl.version);
      console.log("Map instance:", map);
      console.log("Map style:");

      map.on('style.load', () => {
        console.log('Style loaded:');
      });

      map.on('error', (e) => {
        console.error('Map error:', e.error);
      });

      return () => map.remove();
    }
  }, []);

  return <div ref={mapRef} className="w-screen h-screen" />;
}

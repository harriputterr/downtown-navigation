"use client"
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createLayer } from '@/utils/rayUtils'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw';

export default function Map() {

    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapRef.current) {

            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/light-v9',
                center: [-74.0445, 40.6892],
                zoom: 16,
                antialias: true,
                pitch: 60,
                bearing: 120,
            });

            const boxLayer = createLayer();
            map.on('style.load', () => {
                map.addLayer(boxLayer)
            });

            map.on('mousemove', e => {
                boxLayer.raycast(e.point, false);
            });

            map.on('click', e => {
                boxLayer.raycast(e.point, true);
            });

            return () => {
                map.remove()
            }
        }
    }, []);

    return <div ref={mapRef} className="w-screen h-screen" />;
}

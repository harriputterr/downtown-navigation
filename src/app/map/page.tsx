"use client"
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BuildingLayer } from "@/types/layer";
import { createModel } from "@/utils/mapUtils"

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw';

export default function Map() {

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const buildingPlanUrl = 'https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf';
    const floorPlanUrl = "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec-m.gltf";

    useEffect(() => {
        if (mapContainerRef.current) {
            const allLayers: BuildingLayer[] = [];

            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/harriputterr/cls68v8br00fg01r68c319tfy',
                center: [-114.0637750, 51.0475053], // Calgary downtown[lng, lat]
                zoom: 16, // starting zoom,
                antialias: true
            });

            const modelOrigin = { lng: -114.065369360293, lat: 51.04751758577689 };

            const floorLayer = createModel('floor', floorPlanUrl, modelOrigin, 0);

            allLayers.push(floorLayer);


            map.on('style.load', () => {

                allLayers.map((layer) => {
                    map.addLayer(layer, 'waterway-label');
                })

            });

            // Cleanup function to remove the map instance when the component unmounts
            return () => {
                map.remove()
            }
        }
    }, []);

    return <div ref={mapContainerRef} className="w-screen h-screen" />;
}

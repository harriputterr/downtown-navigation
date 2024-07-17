"use client";

import { useEffect, useRef, useState } from "react";
import Stats from "three/examples/jsm/libs/stats.module.js";

import modelData from "./prototype-structure-data/model-data.json";

import { createMap } from "./components/MapboxMap.jsx";
import { createThreeboxInstance } from "./components/Threebox.jsx";
import { createCustomLayer } from "./components/MapboxCustomLayer.jsx";
import { addLights } from "./components/Lights.jsx";

const floorPlanUrl =
  "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec-m.gltf";

export default function model() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [map, setMap] = useState(null);
  const [tb, setTb] = useState(null);
  const [pickables, setPickables] = useState([]);

  const mapRef = useRef(null);

  useEffect(() => {
    // Creating the mapbox map instance.
    if (mapRef.current) {
      setMap(createMap(mapRef));
    }
  }, []);

  useEffect(() => {
    if (map) {
      // Creating the Threebox Instance
      setTb(createThreeboxInstance(map));
    }
  }, [map]);

  useEffect(() => {
    if (tb) {
      // Attaching the threebox instance to the global window object to make it available globally.
      window.tb = tb;

      addLights(tb);

      const addSphere = (coords) => {
        const sphere = tb
          .sphere({
            radius: 1,
            units: "meters",
            color: "green",
            material: "MeshToonMaterial",
            anchor: "center",
          })
          .setCoords(coords);

        tb.add(sphere);
      };

      let stats = new Stats();

      const animate = () => {
        requestAnimationFrame(animate);
        stats.update();
      };

      map.on("style.load", function () {
        map.getContainer().appendChild(stats.dom);
        animate();
        map.addLayer(
          createCustomLayer("3d-model", tb, modelData, setPickables)
        );
        map.on("click", (event) => {
          let intersects = tb.queryRenderedFeatures(event.point);

          console.log("Intersects:", intersects);
          let intersectPointArray;

          if (intersects.length == 0) {
            intersectPointArray = [event.lngLat.lng, event.lngLat.lat, 0];
          } else {
            intersectPointArray = [
              event.lngLat.lng,
              event.lngLat.lat,
              intersects[0].point.z,
            ];
          }

          addSphere(intersectPointArray);
        });
      });

      return () => {
        map.remove();
      };
    }
  }, [tb]);

  const handleHide = () => {
    if (selectedModel) {
      selectedModel.visible = false;
    }
  };

  const handleOpacityChange = (event) => {
    if (selectedModel) {
      const newOpacity = parseFloat(event.target.value);
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.opacity = newOpacity;
          child.material.transparent = true;
        }
      });
    }
  };

  return (
    <>
      <div ref={mapRef} className="w-screen h-screen" />
    </>
  );
}

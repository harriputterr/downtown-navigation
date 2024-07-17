"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import modelData from "./model-data.json";


import {createMap} from './MapboxMap.jsx'
import {createThreeboxInstance} from './Threebox'
import {createCustomLayer} from './MapboxCustomLayer'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
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
    if (mapRef.current){
      setMap(createMap(mapRef))
    }
  },[])

  useEffect(() => {
   if (map){
     // Creating the Threebox Instance
       setTb(createThreeboxInstance(map));
   }
  },[map])

  useEffect(() => {
      if (tb){
        // Attaching the threebox instance to the global window object to make it available globally.
      window.tb = tb;

      // const createCustomLayer = (layerName) => {
      //   return {
      //     id: layerName,
      //     type: "custom",
      //     renderingMode: "3d",
      //     onAdd: function (map, gl) {

      //       const createModels = (modelData) => {
      //         const options = {
      //           type: "gltf",
      //           obj: modelData.url,
      //           units: "meters",
      //           scale: 1,
      //           rotation: modelData.rotation
      //             ? modelData.rotation
      //             : { x: 90, y: 180, z: 0 },
      //           anchor: "center",
      //           bbox: false,
      //         };

      //         tb.loadObj(options, function (model) {
      //           model.setCoords(modelData.origin);
      //           model.addTooltip(modelData.name);
      //           model.traverse((child) => {
      //             if (child.isMesh && child.material){
      //               child.nameId = modelData.id
      //             }
      //           })
      //           model.nameId = modelData.id

      //           tb.add(model);
      //           pickables.push(model);
      //         });

      //         highlightOrigin(modelData.origin);
      //       };
      //       // const secOptions = {
      //       //   type: "gltf",
      //       //   obj: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
      //       //   units: "meters",
      //       //   scale: 1,
      //       //   rotation: { x: 90, y: 180, z: 0 },
      //       //   anchor: "center",
      //       //   bbox: false,
      //       // };

      //       // const floorPlanOptions = {
      //       //   type: "gltf",
      //       //   obj: floorPlanUrl,
      //       //   units: "meters",
      //       //   scale: 1,
      //       //   rotation: { x: 90, y: 180, z: 0 },
      //       //   anchor: "center",
      //       //   bbox: false,
      //       // };

      //       // tb.loadObj(secOptions, function (model) {
      //       //   model.setCoords(origin);
      //       //   model.addTooltip(
      //       //     "Suncor Energy Center Building in Calgary Downtown"
      //       //   );
      //       //   tb.add(model);
      //       //   model.traverse((child) => {
      //       //     if (child.isMesh && child.material) {
      //       //       child.material.format = THREE.RGBAFormat;
      //       //       child.material.transparent = true;
      //       //       child.material.opacity = 1;
      //       //       child.material.wireframe = true;
      //       //       console.log(child)
      //       //     }
      //       //   });
      //       //   pickables.push(model);
      //       // });

      //       // tb.loadObj(floorPlanOptions, function (model) {
      //       //   const origin = [-114.06399405236901, 51.04800708837064, 4.9];
      //       //   model.setCoords(origin);
      //       //   tb.add(model);

      //       //   model.traverse((child) => {
      //       //     if (child.isMesh && child.material) {
      //       //       child.material.format = THREE.RGBAFormat;
      //       //       child.material.transparent = true;
      //       //       child.material.opacity = 0.1;
      //       //       console.log(child)
      //       //     }
      //       //   });
      //       //   pickables.push(model);

      //       //   highlightOrigin(origin);
      //       // });

      //       const highlightOrigin = (origin) => {
      //         const sphere = tb
      //           .sphere({
      //             radius: 1, // adjust radius as needed
      //             units: "meters",
      //             color: "black",
      //             material: "MeshToonMaterial",
      //             anchor: "center",
      //           })
      //           .setCoords(origin);

      //         tb.add(sphere);
      //       };
      //       modelData.map((element) => {
      //         createModels(element);
      //       });
      //     },
      //     render: function (gl, matrix) {
      //       tb.update();
      //     },
      //   };
      // };

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); // Soft white light
      tb.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(100, 100, 100).normalize();
      tb.add(directionalLight);

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
        map.addLayer(createCustomLayer("3d-model", tb, modelData, setPickables));
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

"use client";
import Threebox from "threebox-plugin/src/Threebox";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw";
const floorPlanUrl =
  "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec-m.gltf";

export default function model() {
  const [selectedModel, setSelectedModel] = useState(null);

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

      const tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
        realSunlight: true,
        sky: true,
        enableSelectingObjects: true,
        enableTooltips: true,
      });

      window.tb = tb;

      const modelOrigin = [-114.06403763213298, 51.04794111891039];

      const createCustomLayer = (layerName, origin) => {
        return {
          id: layerName,
          type: "custom",
          renderingMode: "3d",
          onAdd: function (map, gl) {
            const secOptions = {
              type: "gltf",
              obj: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
              units: "meters",
              scale: 1,
              rotation: { x: 90, y: 180, z: 0 },
              anchor: "center",
              bbox: false,
            };

            const floorPlanOptions = {
              type: "gltf",
              obj: floorPlanUrl,
              units: "meters",
              scale: 1,
              rotation: { x: 90, y: 180, z: 0 },
              anchor: "center",
              bbox: false,
            };

            tb.loadObj(secOptions, function (model) {
              model.setCoords(origin);
              model.addTooltip(
                "Suncor Energy Center Building in Calgary Downtown"
              );
              tb.add(model);
              model.traverse((child) => {
                if (child.isMesh && child.material) {
                  child.material.format = THREE.RGBAFormat;
                  child.material.transparent = true;
                  child.material.opacity = 1;
                  child.material.wireframe = true;
                }
              });
              pickables.push(model);
            });

            tb.loadObj(floorPlanOptions, function (model) {
              const origin = [-114.06399405236901, 51.04800708837064, 4.9];
              model.setCoords(origin);
              tb.add(model);

              model.traverse((child) => {
                if (child.isMesh && child.material) {
                  child.material.format = THREE.RGBAFormat;
                  child.material.transparent = true;
                  child.material.opacity = 0.1;
                }
              });
              pickables.push(model);

              highlightOrigin(origin);
            });
            const highlightOrigin = (origin) => {
              const sphere = tb
                .sphere({
                  radius: 1, // adjust radius as needed
                  units: "meters",
                  color: "black",
                  material: "MeshToonMaterial",
                  anchor: "center",
                })
                .setCoords(origin);

              tb.add(sphere);
            };
          },
          render: function (gl, matrix) {
            tb.update();
          },
        };
      };

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); // Soft white light
      tb.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(100, 100, 100).normalize();
      tb.add(directionalLight);

      const pickables = []; // Array to store pickable objects

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

          console.log("This is the sphere you just added! --> ",sphere)
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
        map.addLayer(createCustomLayer("3d-model", modelOrigin));
        map.on("click", (event) => {

          let intersects = tb.queryRenderedFeatures(event.point);

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
  }, []);

  return (
    <>
      <div ref={mapRef} className="w-screen h-screen" />
    </>
  );
}

"use client";
import Threebox from "threebox-plugin/src/Threebox";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'
import * as THREE from "three";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw";

export default function Raycasting() {
  const mapRef = useRef(null);
  let origin1 = [-122.3512, 47.6202, 0];
  let origin2 = [-122.34548, 47.617538, 0];
  let origin3 = [-122.3491, 47.6207, 0];

  let minZoom = 12;
  let names = {
    compositeSource: "composite",
    compositeSourceLayer: "building",
    compositeLayer: "3d-buildings",
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/light-v9",
        center: origin3,
        zoom: 16.5,
        pitch: 60,
        antialias: true,
        heading: 0,
        hash: true,
      });

      let tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
        defaultLights: true,
        enableSelectingFeatures: true, //change this to false to disable fill-extrusion features selection
        enableSelectingObjects: true, //change this to false to disable 3D objects selection
        enableDraggingObjects: true, //change this to false to disable 3D objects drag & move once selected
        enableRotatingObjects: true, //change this to false to disable 3D objects rotation once selected
        enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
      });

      window.tb = tb; 

      const redMaterial = new THREE.MeshPhongMaterial({
        color: 0x660000,
        side: THREE.DoubleSide,
      });
      let stats, gui;
      function animate() {
        requestAnimationFrame(animate);
        stats.update();
      }

      var active = false;

      map.on("style.load", function () {
        init();

        // map.addLayer(createCompositeLayer());

        map.addLayer({
          id: "custom_layer",
          type: "custom",
          renderingMode: "3d",
          onAdd: function (map, mbxContext) {
            tb.altitudeStep = 1;

            const geometry = new THREE.BoxGeometry(30, 60, 120);

            let cube = new THREE.Mesh(geometry, redMaterial);
            cube = tb
              .Object3D({ obj: cube, units: "meters", bbox: false })
              .setCoords(origin1);
            cube.addTooltip(
              "This cube object is selectable but without bounding box",
              true
            );

            tb.add(cube);

            let sphere = tb
              .sphere({
                radius: 30,
                units: "meters",
                sides: 120,
                color: "green",
                material: "MeshPhysicalMaterial",
              })
              .setCoords(origin2);
            tb.add(sphere);
            let options = {
              obj: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
              type: "gltf",
              scale: 1,
              units: "meters",
              rotation: { x: 90, y: 0, z: 0 }, //default rotation
              anchor: "center",
            };

            // tb.loadObj(options, function (model) {
            //   model.setCoords(origin);
            //   model.addTooltip(
            //     "Suncor Energy Center Building in Calgary Downtown"
            //   );
            //   tb.add(model);
            // });

            // tb.loadObj(options, function (model) {
            //   //origin3[2] += model.modelSize.z;
            //   console.log(model)
            //   let building = model.setCoords(origin3);
            //   // console.log(building)
            //   model.addLabel(createLabelIcon("Status: Radioactive"), true); //+ '&#013;' + feature.properties.name
            //   model.addTooltip("This is a custom tooltip", true);

            //   tb.add(building);
              
            // });
          },
          render: function (gl, matrix) {
            tb.update();
          },
        });
      });

      function createCompositeLayer() {
        let layer = {
          id: names.compositeLayer,
          source: names.compositeSource,
          "source-layer": names.compositeSourceLayer,
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: minZoom,
          paint: {
            "fill-extrusion-color": [
              "case",
              ["boolean", ["feature-state", "select"], false],
              "lightgreen",
              ["boolean", ["feature-state", "hover"], false],
              "lightblue",
              "#aaa",
            ],

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              minZoom,
              0,
              minZoom + 0.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              minZoom,
              0,
              minZoom + 0.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.9,
          },
        };
        return layer;
      }

      function createLabelIcon(text) {
        let popup = document.createElement("div");
        popup.innerHTML =
          '<span title="' +
          text +
          '" style="font-size: 30px;color: yellow;">&#9762;</span>';
        return popup;
      }
      let api = {
        fov: (Math.atan(3 / 4) * 180) / Math.PI,
        orthographic: false,
      };

      function init() {
        // stats
        stats = new Stats();
        map.getContainer().appendChild(stats.dom);
        animate();
        // gui
        gui = new GUI();
        // going below 2.5 degrees will start to generate serious issues with polygons in fill-extrusions and 3D meshes
        // going above 45 degrees will also produce clipping and performance issues
        gui.add(api, "fov", 2.5, 45.0).step(0.1).onChange(changeFOV);
        // this will set 0.01 degrees in Mapbox which is the minimum possible and an OrthographicCamera in three.js
        gui
          .add(api, "orthographic")
          .name("pure orthographic")
          .onChange(changeFOV);
      }

      function changeFOV() {
        tb.orthographic = api.orthographic;
        tb.fov = api.fov;
      }
    }
  }, []);

  return (
    <>
      <div ref={mapRef} className="w-screen h-screen" />
    </>
  );
}

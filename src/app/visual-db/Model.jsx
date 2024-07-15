"use client";
import Threebox from "threebox-plugin/src/Threebox";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Stats from "three/examples/jsm/libs/stats.module.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw";

export default function model() {
  const mapRef = useRef(null)
  const [time, setTime] = useState(
    new Date().getHours() * 3600 +
      new Date().getMinutes() * 60 +
      new Date().getSeconds()
  );
  const [date, setDate] = useState(new Date());

  useEffect(() => {

    if (mapRef.current){
      
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

      const updateDateAndTime = (timeValue) => {
        const newDate = new Date();
        newDate.setHours(Math.floor(timeValue / 60 / 60));
        newDate.setMinutes(Math.floor(timeValue / 60) % 60);
        newDate.setSeconds(timeValue % 60);
        setDate(newDate);
      };

      const createCustomLayer = (layerName, origin) => {
        return {
          id: layerName,
          type: "custom",
          renderingMode: "3d",
          onAdd: function (map, gl) {

            const options = {
              type: "gltf",
              obj: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
              units: "meters",
              scale: 1,
              rotation: { x: 90, y: 180, z: 0 },
              anchor: "center",
            };

            tb.loadObj(options, function (model) {
              model.setCoords(origin);
              model.addTooltip(
                "Suncor Energy Center Building in Calgary Downtown"
              );
              tb.add(model);
            });
          },
          render: function (gl, matrix) {
           
            tb.update();
          },
        };
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
      });

      const timeInput = document.getElementById("time");
      if (timeInput) {
        timeInput.value = time;
        timeInput.oninput = (event) => {
          const newTime = +event.target.value;
          setTime(newTime);
          updateDateAndTime(newTime);
          map.triggerRepaint();
        };
      }

      return () => {
        map.remove();
      };
    }
  }, [time, date]);

  return (
    <>
      <div ref={mapRef} className="w-screen h-screen" />
      <input
        id="time"
        type="range"
        min="0"
        max="86400"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <div id="hour"></div>
    </>
  );
}

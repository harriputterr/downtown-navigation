"use client";

import { useEffect, useRef, useState } from "react";
import Stats from "three/examples/jsm/libs/stats.module.js";

import modelData from "./prototype-structure-data/model-data.json";

import { createMap } from "./components/MapboxMap.jsx";
import { createThreeboxInstance } from "./components/Threebox.jsx";
import { createCustomLayer } from "./components/MapboxCustomLayer.jsx";
import { addDataNode } from "./components/AddDateNode.jsx";
import { loadCustomLayer } from "./components/MapEvents.jsx";
import {loadData} from "./components/QueryDB"

export default function VisualDB() {
  const [selectedNode, setSelectedNode] = useState(null);
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



  // useEffect(() => {
  //   loadData();
  // }, []);

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
      // Instantiate a Stats object.
      let stats = new Stats();

      // Creating an animate function to which will be called recursively when the map loads.
      const animate = () => {
        requestAnimationFrame(animate);
        stats.update();
      };

      // Loading our Customer Layer with all of the Map events
      loadCustomLayer(
        map,
        tb,
        stats,
        animate,
        createCustomLayer,
        addDataNode,
        modelData,
        setPickables,
        setSelectedNode
      );

      return () => {
        map.remove();
      };
    }
  }, [tb]);

  return (
    <>
      <div ref={mapRef} className="w-screen h-screen" />
    </>
  );
}

"use client";
import { queryDB } from "@/app/refactor/components/QueryDB";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ImageDisplay({ from, to }) {
  // Refs to store the scene, renderer, and camera instances
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const imagesRef = useRef([]);
  const controlsRef = useRef();

  const [initialView, setInitialView] = useState();

  // State to manage the currently displayed image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  let sphere = null;
  const forwardArrowRef = useRef(null);
  const backwardArrowRef = useRef(null);

  const loadAndRenderImage = (index) => {
    if (!imagesRef.current[index]) {
      console.error("Image URL not found for index:", index);
      return;
    }

    if (sphere) {
      sceneRef.current.remove(sphere); // Remove the existing sphere if any
    }

    const loader = new THREE.TextureLoader();
    loader.load(imagesRef.current[index].imageURL, function (texture) {
      if (sphere) {
        sceneRef.current.remove(sphere);
      }

      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });

      const geometry = new THREE.SphereGeometry(3, 32, 32);
      geometry.scale(-1, 1, 1);
      sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, 0, 0);
      sceneRef.current.add(sphere);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      if (prev < imagesRef.current.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  function handleInitialViewButton() {
    if (cameraRef.current && controlsRef.current) {
      const lookAt = new THREE.Vector3(
        -0.9685079767749152,
        0.05840541811344151,
        -0.2420353405152943
      );

      console.log("This is the lookat",lookAt)
    //   {
    //     "x": -0.9685079767749152,
    //     "y": 0.05840541811344151,
    //     "z": -0.2420353405152943
    // }
      const cameraDirection = new THREE.Vector3();
      cameraRef.current.getWorldDirection(cameraDirection);

      console.log(cameraDirection)

      cameraRef.current.lookAt(lookAt)

      controlsRef.current.target.copy(lookAt);
      controlsRef.current.update();

      // console.log(cameraRef.current)
    }
  }
  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {


      cameraRef.current.lookAt(
        new THREE.Vector3(
          initialView.position.x,
          initialView.position.y,
          initialView.position.z
        )
      );


      console.log(initialView)


    }
  }, [initialView]);

  async function getShortestPathImageUrls() {
    const query = `
      MATCH (startNode:Node {name: $start}), (endNode:Node {name: $stop})
      MATCH path = shortestPath((startNode)-[*]-(endNode))
      RETURN nodes(path) AS pathNodes;
    `;

    const result = await queryDB({
      query,
      type: "read",
      params: { start: from, stop: to },
    });

    if (result.data.length === 0) {
      console.log("No data found");
      return;
    }

    const nodesArray = result.data[0].pathNodes;

    const imagesURL = nodesArray.map((node) => {
      return node.properties.image;
    });

    const imagesObj = imagesURL.map((imageURL) => {
      return {
        imageURL,
        initialView: { lon: 0, lat: 0 },
        forwardArrowDirection: new THREE.Vector3(1, 0, 0),
        backwardArrowDirection: new THREE.Vector3(-1, 0, 0),
      };
    });

    imagesRef.current = imagesObj;
    loadAndRenderImage(0); // Load the first image after data is fetched
  }

  useEffect(() => {
    getShortestPathImageUrls();

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById("webglviewer");

    if (container) {
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;


      controls.enableZoom = true; // Enable zoom
      controls.enablePan = true; // Enable panning
      // controls.enableDamping = true; // Enable damping (inertia)
      // controls.dampingFactor = 0.05; // Set the damping factor (0.05-0.2 is a good range)
      controls.minDistance = 0.1; // Set minimum zoom distance
      controls.maxDistance = 3;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        // console.log(camera.position);
      };

      animate();

      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;
    }
  }, []);

  useEffect(() => {
    loadAndRenderImage(currentImageIndex);
  }, [currentImageIndex]);

  return (
    <div id="webglviewer" className="w-full h-full">
      <button onClick={handleInitialViewButton}>
        Click me to set the initial view
      </button>
      <button
        onClick={handlePrevImage}
        id="leftArrow"
        className="arrow hover:bg-gray-700 hover:text-white"
      >
        ←
      </button>
      <button
        onClick={handleNextImage}
        id="rightArrow"
        className="arrow hover:bg-gray-700 hover:text-white "
      >
        →
      </button>
    </div>
  );
}

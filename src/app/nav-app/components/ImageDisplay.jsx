"use client";
import { queryDB } from "@/app/refactor/components/QueryDB";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function ImageDisplay() {
  const [images, setImages] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  let sphere = null;
  // const images = [
  //   "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/360+images/telus-sky-1.jpg",
  //   "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/360+images/telus-sky-2.jpg",
  //   "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/360+images/telus-sky-3.jpg",
  // ];

  async function getShortestPathImageUrls() {
    const query = `
      MATCH (startNode:Node {name: "start"}), (endNode:Node {name: "stop"})
      MATCH path = shortestPath((startNode)-[*]-(endNode))
      RETURN nodes(path) AS pathNodes;
    `;

    const result = await queryDB({query, type: "read"});

    const nodesArray = result.data[0].pathNodes;

    const imagesURL = nodesArray.map((node) => {
      return node.properties.image
    })
   setImages(imagesURL)

  }
  getShortestPathImageUrls();

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById("webglviewer");
    // const stats = new Stats();
    // stats.showPanel(0); // 0: fps, 1: ms/frame, 2: memory
    // document.body.appendChild(stats.dom);

    if (container) {
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );

      // Move the camera back so we can orbit around the sphere
      camera.position.set(0, 0, 2);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true; // Enable zoom
      controls.enablePan = true; // Enable panning
      controls.enableDamping = true; // Enable damping (inertia)
      controls.dampingFactor = 0.05; //Set the damping factor (0.05-0.2 is a good range)
      controls.minDistance = 0.1; // Set minimum zoom distance
      controls.maxDistance = 3;

      const loader = new THREE.TextureLoader();
      const loadImage = (index) => {
        loader.load(images[index], function (texture) {
          if (sphere) {
            scene.remove(sphere);
          }

          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });

          const geometry = new THREE.SphereGeometry(3, 32, 32);
          geometry.scale(-1, 1, 1);
          sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(0, 0, 0);
          scene.add(sphere);

          renderer.render(scene, camera);
        });
      };

      loadImage(currentImageIndex);

      // loader.load(
      //   "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/360+images/telus-sky-1.jpg",
      //   function (texture) {
      //     const material = new THREE.MeshBasicMaterial({
      //       map: texture,
      //     });

      //     const geometry = new THREE.SphereGeometry(3, 32, 32);
      //     geometry.scale(-1, 1, 1);
      //     const sphere = new THREE.Mesh(geometry, material);
      //     scene.add(sphere);

      //     animate();
      //   }
      // );

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        // stats.update();
        renderer.render(scene, camera);
      };

      animate();

      const handleNextImage = () => {
        setCurrentImageIndex((prev) => {
          if (prev < images.length - 1) {
            loadImage(prev + 1);
            return prev + 1;
          }
          console.log("Images finsished");
          return prev;
        });
      };

      const handlePrevImage = () => {
        setCurrentImageIndex((prev) => {
          if (prev > 0) {
            loadImage(prev - 1);
            return prev - 1;
          }
          console.log("Images finsished");
          return prev;
        });
      };

      document
        .getElementById("leftArrow")
        .addEventListener("click", handlePrevImage);
      document
        .getElementById("rightArrow")
        .addEventListener("click", handleNextImage);

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (container) {
          container.removeChild(renderer.domElement);
        }
      };
    }
  }, [images]);

  return (
    <div id="webglviewer" className="w-96 h-96">
      <button
        id="leftArrow"
        className="arrow hover:bg-gray-700 hover:text-white"
      >
        ←
      </button>
      <button
        id="rightArrow"
        className="arrow hover:bg-gray-700 hover:text-white "
      >
        →
      </button>
    </div>
  );
}

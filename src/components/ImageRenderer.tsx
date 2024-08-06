"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "./ui/button";

const ImageRenderer = ({
    isInitViewEdittable = false,
    image,
}: {
    isInitViewEdittable: boolean;
    image: string;
}) => {
    const geometryRef = useRef<THREE.SphereGeometry | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById("webglviewer") as
            | HTMLDivElement
            | undefined;

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

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                // stats.update();
                renderer.render(scene, camera);
            };

            animate();

            const geometry = new THREE.SphereGeometry(3, 32, 32);
            geometry.scale(-1, 1, 1);

            geometryRef.current = geometry;
            sceneRef.current = scene;
            rendererRef.current = renderer;
            cameraRef.current = camera;
        }
    }, []);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(image, function (texture) {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });

            if (geometryRef.current && sceneRef.current && cameraRef.current) {
                const sphere = new THREE.Mesh(geometryRef.current, material);
                sphere.position.set(0, 0, 0);
                sceneRef.current?.add(sphere);
                rendererRef.current?.render(
                    sceneRef.current,
                    cameraRef.current
                );
            }
        });
    }, [image]);

    return (
        <div id="webglviewer" className="w-full h-full relative">
            {isInitViewEdittable && (
                <Button className="absolute top-2 left-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                    Save Initial View
                </Button>
            )}
        </div>
    );
};

export default ImageRenderer;

"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "./ui/button";

interface InitView {
    initX: number;
    initY: number;
    initZ: number;
}

const ImageRenderer = ({
    isInitViewEdittable = false,
    image,
    onSaveView,
    initView,
}: {
    isInitViewEdittable: boolean;
    image: string;
    onSaveView: (initView: InitView) => void;
    initView: InitView | undefined;
}) => {
    console.log(initView);
    const geometryRef = useRef<THREE.SphereGeometry | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const [animateFlag, setAnimateFlag] = useState(true);

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
            camera.position.set(0, 0, 0);
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = true; // Enable zoom
            controls.enablePan = true; // Enable panning
            controls.enableDamping = true; // Enable damping (inertia)
            controls.dampingFactor = 0.05; //Set the damping factor (0.05-0.2 is a good range)
            controls.minDistance = 0.1; // Set minimum zoom distance
            controls.maxDistance = 3;
            controlsRef.current = controls;

            const geometry = new THREE.SphereGeometry(3, 32, 32);
            geometry.scale(-1, 1, 1);

            geometryRef.current = geometry;
            sceneRef.current = scene;
            rendererRef.current = renderer;
            cameraRef.current = camera;
        }

        return () => {
            setAnimateFlag(false);
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            if (
                controlsRef.current &&
                rendererRef.current &&
                sceneRef.current &&
                cameraRef.current
            ) {
                if (animateFlag) {
                    requestAnimationFrame(animate);
                    controlsRef.current.update();
                    // stats.update();
                    rendererRef.current.render(
                        sceneRef.current,
                        cameraRef.current
                    );
                    console.log("animate");
                }
            }
        };
        animate();

        return () => {
            setAnimateFlag(false);
        };
    }, [animateFlag]);

    useEffect(() => {
        if (initView) {
            const desiredRotation = new THREE.Euler(
                initView.initX, // x rotation in radians
                initView.initY, // y rotation in radians
                initView.initZ, // z rotation in radians
                "XYZ"
            );

            const direction = new THREE.Vector3(0, 0, -1); // Default forward direction
            direction.applyEuler(desiredRotation);

            // Calculate the target position
            const targetPosition = new THREE.Vector3();
            if (cameraRef.current && controlsRef.current) {
                targetPosition.copy(cameraRef.current.position).add(direction);

                // Set the controls target
                controlsRef.current.target.copy(targetPosition);
                controlsRef.current.update();
            }
        }
    }, [initView?.initX, initView?.initY, initView?.initZ]);

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

            setAnimateFlag(false);
        });
    }, [image]);

    function handleSaveInitView() {
        if (cameraRef.current && controlsRef.current) {
            console.log(cameraRef.current.rotation);
            const eulerRotation = cameraRef.current.rotation;

            const { x, y, z } = eulerRotation;
            const initView = {
                initX: x,
                initY: y,
                initZ: z,
            };

            onSaveView(initView);
        }
    }

    return (
        <div id="webglviewer" className="w-full h-full relative">
            {isInitViewEdittable && (
                <Button
                    onClick={handleSaveInitView}
                    className="absolute top-2 left-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                    Save Initial View
                </Button>
            )}
        </div>
    );
};

export default ImageRenderer;

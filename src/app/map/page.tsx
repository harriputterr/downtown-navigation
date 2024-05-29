"use client"
import mapboxgl, { LngLat } from "mapbox-gl";
import { useEffect, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycmlwdXR0ZXJyIiwiYSI6ImNscmw4ZXRvNzBqdzYya3BrcTdhaDlkZGUifQ.croMPXknb0ZuTliWP9BGyw';


// Extend CustomLayerInterface to include additional properties
interface CustomLayer extends mapboxgl.CustomLayerInterface {
    camera?: THREE.Camera;
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    map?: mapboxgl.Map;
}



export default function Map() {

    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/harriputterr/cls68v8br00fg01r68c319tfy', // style URL
                // center: [-114.065381, 51.047498], // Calgary downtown[lng, lat]
                center: [148.9819, -35.3981],
                zoom: 16, // starting zoom,
                antialias: true
            });


            // parameters to ensure the model is georeferenced correctly on the map
            // const modelOrigin = [148.9819, -35.39847];
            const modelOrigin = {lng:148.9819 , lat: -35.39847}
            const modelAltitude = 0;
            const modelRotate = [Math.PI / 2, 0, 0];

            const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                modelOrigin,
                modelAltitude
            );

            const modelTransform = {
                translateX: modelAsMercatorCoordinate.x,
                translateY: modelAsMercatorCoordinate.y,
                translateZ: modelAsMercatorCoordinate.z ?? 0,
                rotateX: modelRotate[0],
                rotateY: modelRotate[1],
                rotateZ: modelRotate[2],
                /* Since the 3D model is in real world meters, a scale transform needs to be
                 * applied since the CustomLayerInterface expects units in MercatorCoordinates.
                 */
                scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
            };

            const customLayer: CustomLayer = {
                id: '3d-model',
                type: 'custom',
                renderingMode: '3d',
                onAdd: function (map, gl) {
                    this.camera = new THREE.Camera();
                    this.scene = new THREE.Scene();
        
                    // create two three.js lights to illuminate the model
                    const directionalLight = new THREE.DirectionalLight(0xffffff);
                    directionalLight.position.set(0, -70, 100).normalize();
                    this.scene.add(directionalLight);
        
                    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                    directionalLight2.position.set(0, 70, 100).normalize();
                    this.scene.add(directionalLight2);
        
                    // use the three.js GLTF loader to add the 3D model to the three.js scene
                    const loader = new GLTFLoader();
                    loader.load(
                        'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
                        (gltf: GLTF) => {
                            this.scene!.add(gltf.scene);
                        }
                    );
                    this.map = map;
        
                    // use the Mapbox GL JS map canvas for three.js
                    this.renderer = new THREE.WebGLRenderer({
                        canvas: map.getCanvas(),
                        context: gl,
                        antialias: true
                    });
        
                    this.renderer.autoClear = false;
                },
                render: function (gl, matrix) {
                    const rotationX = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(1, 0, 0),
                        modelTransform.rotateX
                    );
                    const rotationY = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(0, 1, 0),
                        modelTransform.rotateY
                    );
                    const rotationZ = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(0, 0, 1),
                        modelTransform.rotateZ
                    );
        
                    const m = new THREE.Matrix4().fromArray(matrix);
                    const l = new THREE.Matrix4()
                        .makeTranslation(
                            modelTransform.translateX,
                            modelTransform.translateY,
                            modelTransform.translateZ
                        )
                        .scale(
                            new THREE.Vector3(
                                modelTransform.scale,
                                -modelTransform.scale,
                                modelTransform.scale
                            )
                        )
                        .multiply(rotationX)
                        .multiply(rotationY)
                        .multiply(rotationZ);
        
                        if (!this.camera || !this.scene || !this.renderer || !this.map){
                            return;
                        }
                    this.camera.projectionMatrix = m.multiply(l);
                    this.renderer.resetState();
                    this.renderer.render(this.scene, this.camera);
                    this.map.triggerRepaint();
                }
            };

            map.on('style.load', () => {
                map.addLayer(customLayer, 'waterway-label');
            });

            // Cleanup function to remove the map instance when the component unmounts
            return () => map.remove();
        }
    }, []);

    return <div ref={mapContainerRef} className="w-screen h-screen" />;
}

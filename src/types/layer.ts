import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';

// Extend CustomLayerInterface to include additional properties
export interface BuildingLayer extends mapboxgl.CustomLayerInterface {
    camera?: THREE.PerspectiveCamera;
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    map?: mapboxgl.Map;
    cameraHelper?: THREE.Mesh
    cameraTransform?: THREE.Matrix4;
}

// Understaning raytracing here

export interface CustomLayer extends mapboxgl.CustomLayerInterface {
    camera?: THREE.PerspectiveCamera;
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    map?: mapboxgl.Map;
    cameraTransform?: THREE.Matrix4;
    makeScene: () => THREE.Scene;
    raycaster?: THREE.Raycaster
    raycast: (point: any, isClick: boolean) => void
    addCubeAtIntersection: (point: any) => void;
}
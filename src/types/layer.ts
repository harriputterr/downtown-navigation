import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';

// Extend CustomLayerInterface to include additional properties
export interface BuildingLayer extends mapboxgl.CustomLayerInterface {
    camera?: THREE.Camera;
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    map?: mapboxgl.Map;
}

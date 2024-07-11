import * as THREE from "three";
import { BuildingLayer } from "@/types/layer";
import { ModelTransform } from "@/types/models";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.d.ts";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { v4 as uuidv4 } from "uuid";

import mapboxgl from "mapbox-gl";

function createModelTransform(
  modelOrigin: mapboxgl.LngLatLike,
  modelAltitude: number,
  modelRotate: number[]
) {
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );

  return {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z ?? 0, // Provide a default value of 0 if undefined
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };
}

function createLayerGLTF(
  buildingModelurl: string,
  modelOrigin: { lng: number; lat: number },
  modelAltitude: number
): BuildingLayer {
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelTransform = createModelTransform(
    modelOrigin,
    modelAltitude,
    modelRotate
  );

  return {
    id: uuidv4(),
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map, gl) {

      // making the appropriate scale for camera
      const centerLngLat = map.getCenter();
      const center = mapboxgl.MercatorCoordinate.fromLngLat(centerLngLat, 0);
      const { x, y, z } = center;
      const s = center.meterInMercatorCoordinateUnits();

      const scale = new THREE.Matrix4().makeScale(s, s, -s);
      const rotation = new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().makeRotationX(-0.5 * Math.PI),
        new THREE.Matrix4().makeRotationY(Math.PI)
      );
      this.cameraTransform = new THREE.Matrix4()
        .multiplyMatrices(scale, rotation)
        .setPosition(x, y, z!);

      const pickables: THREE.Mesh[] = [];

      const fov = 75; // Field of view
      const aspect = window.innerWidth / window.innerHeight; // Aspect ratio
      const near = 0.1; // Near clipping plane
      const far = 1e6; // Far clipping plane

      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.scene = new THREE.Scene();
      this.map = map;

      const directionalLight1 = new THREE.DirectionalLight(0xffffff);
    
      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    
      directionalLight1.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight1);
      directionalLight2.position.set(0, 70, -100).normalize();
      this.scene.add(directionalLight2);

      const directionalLightHelper1 = new THREE.DirectionalLightHelper(
        directionalLight1
      );

      const directionalLightHelper2 = new THREE.DirectionalLightHelper(
        directionalLight2
      );
      // directionalLightHelper1.visible = true;
      // this.scene.add(directionalLightHelper1);
      // directionalLightHelper2.visible = true;
      // this.scene.add(directionalLightHelper2);

      // use the three.js GLTF loader to add the 3D model to the three.js scene
      const loader = new GLTFLoader();
      loader.load(buildingModelurl, (gltf: GLTF) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            pickables.push(child);

            // const box = new THREE.BoxHelper(child, 0xffff00);
            // this.scene!.add(box);
          }
        });

        this.scene!.add(gltf.scene);
      });
      this.map = map;
      
      // console.log(map)
      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      const arrowHelper = new THREE.ArrowHelper();
      arrowHelper.setLength(100);
      this.scene.add(arrowHelper);

      this.renderer.domElement.addEventListener("click", (e) => {
        const clientWidth = this.renderer?.domElement.clientWidth;
        const clientHeight = this.renderer?.domElement.clientHeight;

        if (clientHeight && clientWidth) {
          mouse.set(
            (e.clientX / clientWidth) * 2 - 1,
            -(e.clientY / clientHeight) * 2 + 1
          );
        }

        // console.log(mouse);
        // console.log(this.camera)
        if (this.camera) {
          raycaster.setFromCamera(mouse, this.camera);
          const intersects = raycaster.intersectObjects(pickables, false);
          console.log("Intersects: ", intersects)
          // console.log("Pickables: ", pickables)
          // console.log("Mouse: ", mouse)
          // console.log("Raycaster: ", raycaster)
          // console.log("Camera: ", this.camera)
          this.cameraHelper = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10),new THREE.MeshPhongMaterial({ color: 0x000000 }));
          this.cameraHelper.position.set( 10,  10, 10)

          this.scene!.add(this.cameraHelper)
          console.log("camera position:" , this.camera.position)
          console.log("cameraHelper position:" , this.cameraHelper.position)
          if (intersects.length) {
            const n = new THREE.Vector3();
            n.copy((intersects[0].face as THREE.Face).normal);
            n.transformDirection(intersects[0].object.matrixWorld);

            arrowHelper.setDirection(n);
            arrowHelper.position.copy(intersects[0].point);

            const cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10),new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
            cube.position.copy(intersects[0].point);
            
            this.scene!.add(cube);
            pickables.push(cube)
          }
        }
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

      if (!this.camera || !this.scene || !this.renderer || !this.map) {
        return;
      }

      const freeCameraOptions = this.map.getFreeCameraOptions();
      const position = freeCameraOptions.position;
      
      if (position) {
        // Use a default value of 0 for position.z if it is undefined
        const z = position.z !== undefined ? position.z : 0;
        this.camera.position.set(position.x, position.y, z);
      }

      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    },
  };
}

export function createModel(
  modelType: string, // floorplan, building
  modelURL: string,
  modelOrigin: { lng: number; lat: number },
  modelAltitude: number
): BuildingLayer {
  if (modelType === "building") {
    return createLayerGLTF(modelURL, modelOrigin, modelAltitude);
  } else {
    return createLayerGLTF(modelURL, modelOrigin, modelAltitude);
  }
}

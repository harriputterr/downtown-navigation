import * as THREE from "three";
import { CustomLayer } from "@/types/layer";
import { v4 as uuidv4 } from "uuid";

import mapboxgl from "mapbox-gl";

export function createLayer(): CustomLayer {
  return {
    id: uuidv4(),
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map, gl) {
      this.camera = new THREE.PerspectiveCamera(
        28,
        window.innerWidth / window.innerHeight,
        0.1,
        1e6
      );
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

      this.map = map;
      this.scene = this.makeScene();

      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      this.renderer.autoClear = false;

      this.raycaster = new THREE.Raycaster();
      this.raycaster.near = -1;
      this.raycaster.far = 1e2;
    },
    makeScene: function () {
      this.scene = new THREE.Scene();
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      this.scene.add(new THREE.HemisphereLight(skyColor, groundColor, 0.25));

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(-70, -70, 100).normalize();
      // Directional lights implicitly point at (0, 0, 0).
      this.scene.add(directionalLight);

      const group = new THREE.Group();
      group.name = "$group";

      const geometry = new THREE.BoxGeometry(100, 100, 100);
      geometry.translate(0, 50, 0);
      const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
      });
      const cube = new THREE.Mesh(geometry, material);

      group.add(cube);
      this.scene.add(group);

      return this.scene;
    },
    render: function (gl, matrix) {
      this.camera!.projectionMatrix = new THREE.Matrix4()
        .fromArray(matrix)
        .multiply(this.cameraTransform!);
      this.renderer!.state.reset();
      this.renderer!.render(this.scene!, this.camera!);
    },
    raycast: function (point, isClick) {
      var mouse = new THREE.Vector2();
      //@ts-ignore
      mouse.x = (point.x / this.map!.transform.width) * 2 - 1;
      //@ts-ignore
      mouse.y = 1 - (point.y / this.map!.transform.height) * 2;
      const camInverseProjection = new THREE.Matrix4()
        .copy(this.camera!.projectionMatrix)
        .invert();
      const cameraPosition = new THREE.Vector3().applyMatrix4(
        camInverseProjection
      );
      const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 1).applyMatrix4(
        camInverseProjection
      );
      const viewDirection = mousePosition
        .clone()
        .sub(cameraPosition)
        .normalize();

      this.raycaster!.set(cameraPosition, viewDirection);
      const intersects = this.raycaster!.intersectObjects(
        this.scene!.children,
        true
      );

      if (intersects.length) {
        for (let i = 0; i < intersects.length; ++i) {
          if (isClick) {
            console.log(intersects[i]);
            this.addCubeAtIntersection(intersects[i].point);
          }
        }
      }
    },
    addCubeAtIntersection: function (point) {
      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.copy(point);
      
      this.scene!.add(cube);
    },
  };
}

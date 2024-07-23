import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import mapboxgl from "mapbox-gl";

export default function CreateRelations({ nodeStateObj, className, tb, map }) {
  let areTwoSelected = false;

  if (nodeStateObj.nodeA && nodeStateObj.nodeB) {
    areTwoSelected = true;
  }
  const createLineWithRaycasting = (lineSegment) => {
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    const mat = new MeshLineMaterial({
      color: 0xff0000,
      opacity: 1,
      resolution: resolution,
      sizeAttenuation: 1,
      lineWidth: 0.1,
      depthTest: false,
      transparent: false,
    });

    const straightProject = utils.lnglatsToWorld(lineSegment.geometry);
    const normalized = utils.normalizeVertices(straightProject);
    const flattenedArray = utils.flattenVectors(normalized.vertices);
    console.log(straightProject, normalized, flattenedArray)

    const line2 = new MeshLine();
    line2.setPoints(flattenedArray);
    
    const middlepoint = {
      x: (lineSegment.geometry[0][0] + lineSegment.geometry[1][0]) / 2,
      y: (lineSegment.geometry[0][1] + lineSegment.geometry[1][1]) / 2,
    };

    const mesh = new THREE.Mesh(line2.geometry, mat);
    mesh.raycast = MeshLineRaycast;

    const lineX = tb.Object3D({ obj: mesh, anchor: "center", bbox: true });
    lineX.setCoords([middlepoint.x, middlepoint.y, 0]);
    // lineX.addTooltip("Linha :", true);

    tb.add(lineX);
    console.log(lineX)
    tb.update();
    map.repaint = true;
    return lineX;
  };

  const utils = {
    // Convert longitude and latitude to Three.js world coordinates
    lnglatsToWorld: function (geometry) {
      const vertices = geometry.map(([lng, lat]) => {
        const coords = mapboxgl.MercatorCoordinate.fromLngLat([lng, lat]);
        return [coords.x, coords.y, 0];
      });
      return { vertices };
    },

    // Normalize vertices to the unit sphere
    normalizeVertices: function (verticesObj) {
      const { vertices } = verticesObj;
      const center = vertices
        .reduce(
          (acc, [x, y, z]) => [acc[0] + x, acc[1] + y, acc[2] + z],
          [0, 0, 0]
        )
        .map((sum) => sum / vertices.length);

      const normalized = vertices.map(([x, y, z]) => [
        x - center[0],
        y - center[1],
        z - center[2],
      ]);

      return { vertices: normalized };
    },

    // Flatten the vertices array
    flattenVectors: function (vertices) {
      return vertices.reduce((acc, val) => acc.concat(val), []);
    },
  };

  function handleClick() {
    console.log(tb.world.children)
    const nodeAPointGeometry = [
      nodeStateObj.nodeA.point.x,
      nodeStateObj.nodeA.point.y,
      nodeStateObj.nodeA.point.z,
    ];

    console.log(nodeAPointGeometry);

    const nodeBPointGeometry = [
      nodeStateObj.nodeB.point.x,
      nodeStateObj.nodeB.point.y,
      nodeStateObj.nodeB.point.z,
    ];

    console.log(nodeBPointGeometry);

    const lineGeometry = {
      geometry: [nodeAPointGeometry, nodeBPointGeometry]
    };

    createLineWithRaycasting(lineGeometry);

    // const options = {
    //   geometry: lineGeometry,
    //   width: 10,
    //   color: "red",
    // };

    // const line = tb.line(options);
    // console.log(line);
    // tb.add(line);
    // map.repaint = true;
    // tb.update();
    // console.log(tb.world.children);
  }
  return (
    <>
      {areTwoSelected && (
        <>
          <Button onClick={handleClick} className={className}>
            Create Relation
          </Button>
        </>
      )}
    </>
  );
}

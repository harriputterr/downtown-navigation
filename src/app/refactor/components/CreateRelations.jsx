import * as THREE from "three";
import { Button } from "@/components/ui/button";

export default function CreateRelations({ nodeStateObj, className, tb, map }) {
  let areTwoSelected = false;

  if (nodeStateObj.nodeA && nodeStateObj.nodeB) {
    areTwoSelected = true;
  }

  function handleClick() {
    // const geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //   new THREE.Vector3(
    //     nodeStateObj.nodeA.point.x,
    //     nodeStateObj.nodeA.point.y,
    //     nodeStateObj.nodeA.point.z
    //   ),
    //   new THREE.Vector3(
    //     nodeStateObj.nodeB.point.x,
    //     nodeStateObj.nodeB.point.y,
    //     nodeStateObj.nodeB.point.z
    //   )
    // );

    // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // const line = new THREE.Line(geometry, material);
    // tb.add(line);
    const nodeAPointGeometry = [
      nodeStateObj.nodeA.point.x,
      nodeStateObj.nodeA.point.y,
      nodeStateObj.nodeA.point.z,
    ];

    const nodeBPointGeometry = [
      nodeStateObj.nodeB.point.x,
      nodeStateObj.nodeB.point.y,
      nodeStateObj.nodeB.point.z,
    ];

    const lineGeometry = [
      nodeAPointGeometry,
      nodeBPointGeometry
    ]

    const options = {
      geometry: lineGeometry,
    }

    const line = tb.line(options);
    console.log(line)

    map.repaint = true;
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

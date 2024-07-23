import * as THREE from "three";
import { Button } from "@/components/ui/button";

export default function CreateRelations({ nodeStateObj, className, tb, map }) {
  let areTwoSelected = false;

  if (nodeStateObj.nodeA && nodeStateObj.nodeB) {
    areTwoSelected = true;
  }
  
  function handleClick() {
 
    const nodeAPointGeometry = [
      nodeStateObj.nodeA.point.x,
      nodeStateObj.nodeA.point.y,
      nodeStateObj.nodeA.point.z,
    ];

    console.log(nodeAPointGeometry)

    const nodeBPointGeometry = [
      nodeStateObj.nodeB.point.x,
      nodeStateObj.nodeB.point.y,
      nodeStateObj.nodeB.point.z,
    ];

    console.log(nodeBPointGeometry)

    const lineGeometry = [
      nodeAPointGeometry,
      nodeBPointGeometry
    ]

    const options = {
      geometry: lineGeometry,
      width: 10,
      color: "red"
    }

    const line = tb.line(options);
    console.log(line)
    tb.add(line)
    map.repaint = true;
    tb.update()
    console.log(tb.world.children)
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

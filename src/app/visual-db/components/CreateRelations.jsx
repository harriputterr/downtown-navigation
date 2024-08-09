import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { queryDB } from './QueryDB'



export const getRelationships = async () => {
  const query = `
    MATCH (a:Node)-[r:CONNECTED]->(b:Node)
    RETURN a, b, r;
  `;

  try {
    const result = await queryDB({ query, type: 'read' });
    return result;
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return [];
  }
};

export const recreateLines = async (map, tb) => {

  const relationships = await getRelationships();
  
  relationships.data.forEach(rel => {
    const nodeA = rel.a.properties;
    const nodeB = rel.b.properties;
    const lineUUID = rel.r.properties.uuid;

    const nodeAPointGeometry = [
      nodeA.point.x,
      nodeA.point.y,
      nodeA.point.z + 0.3,
    ];

    const nodeBPointGeometry = [
      nodeB.point.x,
      nodeB.point.y,
      nodeB.point.z + 0.3,
    ];

    const lineGeometry = [
      nodeAPointGeometry,
      nodeBPointGeometry,
    ];

    const options = {
      geometry: lineGeometry,
      width: 5,
      color: 'black',
    };

    const midpoint = [
      (nodeAPointGeometry[0] + nodeBPointGeometry[0]) / 2,
      (nodeAPointGeometry[1] + nodeBPointGeometry[1]) / 2,
      (nodeAPointGeometry[2] + nodeBPointGeometry[2]) / 2,
    ];

    const line = tb.line(options);
    line.uuid = lineUUID;  // Set the UUID from the database
    tb.add(line);

    // const tooltipElement = document.createElement('div');
    // tooltipElement.className = 'tooltip';
    // tooltipElement.innerHTML = `<p>${line.uuid}</p>`;

    // const tooltipOptions = {
    //   htmlElement: tooltipElement,
    //   alwaysVisible: true,
    // };

    // const tooltip = tb.label(tooltipOptions).setCoords(midpoint);
    // tb.add(tooltip);
  });

  map.repaint = true;
  tb.update();
};


export default function CreateRelations({ nodeStateObj, className, tb, map }) {
  let areTwoSelected = false;

  if (nodeStateObj.nodeA && nodeStateObj.nodeB) {
    areTwoSelected = true;
  }

  async function handleClick() {
   
    const nodeAPointGeometry = [
      nodeStateObj.nodeA.point.x,
      nodeStateObj.nodeA.point.y,
      nodeStateObj.nodeA.point.z + 0.3,
    ];

    console.log(nodeAPointGeometry)

    const nodeBPointGeometry = [
      nodeStateObj.nodeB.point.x,
      nodeStateObj.nodeB.point.y,
      nodeStateObj.nodeB.point.z + 0.3,
    ];

    console.log(nodeBPointGeometry)

    const lineGeometry = [
      nodeAPointGeometry,
      nodeBPointGeometry
    ]

    const options = {
      geometry: lineGeometry,
      width: 5,
      color: "black"
    }

    const midpoint = [
      (nodeAPointGeometry[0] + nodeBPointGeometry[0]) / 2,
      (nodeAPointGeometry[1] + nodeBPointGeometry[1]) / 2,
      (nodeAPointGeometry[2] + nodeBPointGeometry[2]) / 2
    ];

    

    const line = tb.line(options);
    console.log(line)
    tb.add(line)
    map.repaint = true;
    tb.update()

    // const tooltipElement = document.createElement('div');
    // tooltipElement.className = 'tooltip';
    // tooltipElement.innerHTML = `
    //   <p>${line.uuid}</p>
    // `;


    // // Create a tooltip
    // const tooltipOptions = {
    //   htmlElement: tooltipElement,
    //   alwaysVisible: true,
    //   // cssClass: "tooltip"
    // };

    // const tooltip = tb.label(tooltipOptions).setCoords(midpoint);
    // console.log(tooltip)
    // tb.add(tooltip);


    const nodeAUUID = nodeStateObj.nodeA.uuid;
    const nodeBUUID = nodeStateObj.nodeB.uuid;
    const lineUUID = line.uuid; 
    const query = `
      MATCH (a: Node {uuid: $nodeAUUID}), (b: Node {uuid: $nodeBUUID})
      CREATE (a)-[r:CONNECTED {uuid: $lineUUID, fromNode: $nodeAUUID, toNode: $nodeBUUID}]->(b)
      RETURN r;
    `
    const params = {
      nodeAUUID,
      nodeBUUID,
      lineUUID
    };

    try {
      const result = await queryDB({ query, type: "write", params });
      return { success: true, message: "Relationship created successfully", result };
    } catch (error) {
      console.error("Error creating relationship:", error);
      return { success: false, message: "Error creating relationship", error };
    }
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

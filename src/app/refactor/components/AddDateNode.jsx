import { queryDB } from "./QueryDB";
import {getNodeByUUID} from './GetNode';

export const addDataNode = async ({tb, coords, uuid, addToDb = false}, setSelectedNode) => {
  const [x, y, z] = coords;
  const sphere = tb
    .sphere({
      radius: 1,
      units: "meters",
      color: "green",
      material: "MeshToonMaterial",
      anchor: "center",
    })
    .setCoords(coords);

  sphere.addEventListener("SelectedChange", async (event) => {
    if (event.detail.selected){
      console.log(event.detail.uuid)
      const result = await getNodeByUUID(event.detail.uuid);
      setSelectedNode(result.data[0].n.properties);
      
    }
    else{
      setSelectedNode(null);
    }
  });
  
  if (addToDb && !uuid) {

    const query = `
    CREATE (n:Node {
        uuid: $uuid,
        point: point({x: $x, y: $y, z: $z})
      }) 
    RETURN n;`;
    const params = { uuid: sphere.uuid, x, y, z };

    const result = await queryDB({ query, type: "write", params });
  }else{
    sphere.uuid = uuid
  }

  sphere.addTooltip(sphere.uuid)
  tb.add(sphere);

  return sphere;
};

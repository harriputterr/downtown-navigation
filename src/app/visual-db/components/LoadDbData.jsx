import {queryDB} from "./QueryDB";
import { addDataNode } from "./DataNodeCRUD";

export async function loadDbData(tb, setNodeStateObj, map) {
  const query = "MATCH (n) RETURN n;";
  const result = await queryDB({ query, type: "read" });

  if (result.data.length == 0){
    return null;
  }

    result.data.map((e) => {
        const {x, y, z} = e.n.properties.point
        const uuid = e.n.properties.uuid
        const coords = [x, y, z];
        addDataNode({tb, coords, uuid, map}, setNodeStateObj)
    })
  return result;
}

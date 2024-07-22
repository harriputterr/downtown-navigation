import { queryDB } from "./QueryDB";
import { getNodeByUUID } from "./GetNode";

export const addDataNode = async (
  { tb, coords, uuid, addToDb = false },
  setNodeStateObj
) => {
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
    if (event.detail.selected) {
      console.log(event.detail.uuid);
      const result = await getNodeByUUID(event.detail.uuid);

      setNodeStateObj((prev) => {
        const newState = { ...prev };
        newState.selectedNode = result.data[0].n.properties
        if (prev.counter == 0) {
          newState.counter = prev.counter + 1;
          newState.nodeB = null;
          newState.nodeA = result.data[0].n.properties;
        } else {
          newState.counter = 0;
          newState.nodeB = result.data[0].n.properties;
        }

        return newState;
      });
    } else {
      setNodeStateObj((prev) => {
        const newState = {...prev};
        newState.selectedNode = null;
        return newState;
      })
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
  } else {
    sphere.uuid = uuid;
  }

  sphere.addTooltip(sphere.uuid);
  tb.add(sphere);

  return sphere;
};

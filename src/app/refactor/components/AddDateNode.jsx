import { queryDB } from "./QueryDB";

export const addDataNode = async (tb, coords, setSelectedNode) => {
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

  console.log(coords);
  const query = `CREATE 
    (n:Node {point: 
    point({
      x: ${x},
      y: ${y},
      z: ${z}
      })
    });`;

  const result = await queryDB({ query, type: "write" });
  console.log(result);

  sphere.addEventListener("SelectedChange", (event) => {
    console.log(event);
  });

  tb.add(sphere);
};

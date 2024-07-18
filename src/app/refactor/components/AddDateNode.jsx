export const addDataNode = (tb, coords, setSelectedNode) => {
  const sphere = tb
    .sphere({
      radius: 1,
      units: "meters",
      color: "green",
      material: "MeshToonMaterial",
      anchor: "center",
    })
    .setCoords(coords);

    console.log(sphere);

  sphere.addEventListener('SelectedChange', (event) => {
    console.log(event);
  })

  tb.add(sphere);
};

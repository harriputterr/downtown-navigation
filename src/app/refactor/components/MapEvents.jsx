export const loadCustomLayer = (
  map,
  tb,
  stats,
  animate,
  createCustomLayer,
  addDataNode,
  modelData,
  setPickables,
  setSelectedNode
) => {
  map.on("style.load", function () {
    map.getContainer().appendChild(stats.dom);

    animate();

    map.addLayer(createCustomLayer("3d-model", tb, modelData, setPickables));

    map.on("click", (event) => {
      let intersects = tb.queryRenderedFeatures(event.point);

      console.log("Intersects:", intersects);
      let intersectPoint;

      if (intersects.length == 0) {
        intersectPoint = [event.lngLat.lng, event.lngLat.lat, 0];
      } else {
        intersectPoint = [
          event.lngLat.lng,
          event.lngLat.lat,
          intersects[0].point.z,
        ];
      }

      // If the clicked object is a Data node then do not execute addDataNode again.
      const isSphereGeometry = intersects[0]?.object?.geometry?.type === "SphereGeometry"

      if (!isSphereGeometry || isSphereGeometry == undefined){
        addDataNode(tb, intersectPoint, setSelectedNode);
      }

    });
  });
};

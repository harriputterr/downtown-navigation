import { loadDbData } from './LoadDbData'
export const loadCustomLayerAndEventListeners = (
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
  map.on("style.load", async function () {
    map.getContainer().appendChild(stats.dom);

    stats.dom.style.cssText = '';
    stats.dom.style.position = 'fixed';
    stats.dom.style.bottom = '0px';
    stats.dom.style.left = '0px';
    stats.dom.style.cursor = 'pointer';
    stats.dom.style.opacity = '0.9';
    stats.dom.style.zIndex = '10000';

    animate();

    map.addLayer(createCustomLayer("3d-model", tb, modelData, setPickables));

    // Fetch and add all of the data nodes from neo4j DB
    await loadDbData(tb, setSelectedNode);

    map.on("click", (event) => {
      let intersects = tb.queryRenderedFeatures(event.point);

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
        addDataNode({tb, coords: intersectPoint, uuid: null, addToDb: true}, setSelectedNode);
      }

    });
  });
};
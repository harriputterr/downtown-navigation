import Threebox from "threebox-plugin/src/Threebox";

export const createThreeboxInstance = (map) => {
  const tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
    defaultLights: true,
    sky: true,
    enableSelectingObjects: true,
    enableTooltips: true,
    // orthographic: true,
    enableTooltips: true
  });

  return tb;
};

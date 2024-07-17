import Threebox from "threebox-plugin/src/Threebox";

export const createThreeboxInstance = (map) => {
  const tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
    realSunlight: true,
    sky: true,
    enableSelectingObjects: true,
    enableTooltips: true,
  });

  return tb;
};

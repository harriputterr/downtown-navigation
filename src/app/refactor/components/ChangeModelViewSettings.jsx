import { findObjectInWorldViaModelId } from "./FindObjectInWorld";
import * as THREE from 'three'

export default function ChangeModelViewSettings(
  activeModelId,
  allModelSettings,
  map,
  tb
) {
  const model = findObjectInWorldViaModelId(activeModelId, tb);

  if (model && allModelSettings.length > 0) {
    console.log(allModelSettings)

    const activeModelSettingsObj = allModelSettings.find((value) => {
      return value.modelId == activeModelId;
    });

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        if (activeModelSettingsObj.settings.includes("min-opacity")){
          child.material.format = THREE.RGBAFormat;
          child.material.transparent = true;
          child.material.opacity = 0.2;
        }
        if (activeModelSettingsObj.settings.includes("wireframe")){
          child.material.wireframe = true;
        }
        if (activeModelSettingsObj.settings.includes("raycasting")){
          child.raycasted = false;
        }
        // if(activeModelSettingsObj.settings.includes("visible"))
        tb.update()
        map.repaint = true;
      }
    });
  }
}

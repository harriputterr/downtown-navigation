import { findObjectInWorldViaModelId } from "./FindObjectInWorld";
import * as THREE from "three";

export default function ChangeModelViewSettings(
  activeModelId,
  allModelSettings,
  map,
  tb
) {
  

  const model = findObjectInWorldViaModelId(activeModelId, tb);

  if (model && allModelSettings.length > 0) {


    const activeModelSettingsObj = allModelSettings.find((value) => {
      return value.modelId == activeModelId;
    });



    model.traverse((child) => {
     
      if (child.isMesh && child.material && activeModelSettingsObj) {
        
        if (activeModelSettingsObj.settings.includes("min-opacity")) {
          child.material.format = THREE.RGBAFormat;
          child.material.transparent = true;
          child.material.opacity = 0.2;
        } else {
          child.material.transparent = false;
          child.material.opacity = 1;
        }

        if (activeModelSettingsObj.settings.includes("wireframe")) {
          child.material.wireframe = true;
        } else {
          child.material.wireframe = false;
        }

        if (activeModelSettingsObj.settings.includes("raycasting-off")) {
          model.raycasted = false;
        } else {
          model.raycasted = true;
        }

        if (activeModelSettingsObj.settings.includes("visibility-off")) {
          model.visibility = false;
        } else {
          model.visibility = true;
        }
        tb.update();
        map.repaint = true;
      }
    });
  }
}

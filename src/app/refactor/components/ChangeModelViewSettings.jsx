import { findObjectInWorldViaModelId } from "./FindObjectInWorld";

export default function ChangeModelViewSettings(
  activeModelId,
  modelSettings,
  map,
  tb
) {
  
  const model = findObjectInWorldViaModelId(activeModelId, tb)
  if (model){
    model.traverse((child) => {
      if (child.isMesh && child.material){
        console.log(child)
      }
    })
  }
}

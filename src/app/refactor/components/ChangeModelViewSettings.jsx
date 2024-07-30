import { findObjectInWorldViaModelId } from "./FindObjectInWorld";

export default function ChangeModelViewSettings(
  activeModelId,
  modelSettings,
  map,
  tb
) {
  const model = findObjectInWorldViaModelId(activeModelId, tb)
  console.log(model)
  
  model.traverse(child => {
    if (child.isMesh){
        console.log(child)
    }
  } )
}

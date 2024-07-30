import React from "react";

export function findObjectInWorldViaUUID(uuid, tb) {
  let model = null;

  tb.world.children.forEach((object) => {
    object.traverse((child) => {
      if (child.uuid === uuid) {
        model = child;
        
      }
    });
  });

  return model;
}

export function findObjectInWorldViaModelId(modelId, tb) {
  let model = null;

  tb.world.children.forEach((object) => {
    object.traverse((child) => {
      if (child.modelId === modelId) {
        model = child;
        
      }
    });
  });

  return model;
}

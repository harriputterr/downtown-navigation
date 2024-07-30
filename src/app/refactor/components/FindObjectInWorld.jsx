import React from "react";

export function findObjectInWorld(uuid) {
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

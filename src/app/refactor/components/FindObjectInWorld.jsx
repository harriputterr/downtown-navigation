import React from "react";

export function findObjectInWorld(uuid) {
  let foundNode = null;

  tb.world.children.forEach((object) => {
    object.traverse((child) => {
      if (child.uuid === uuid) {
        foundNode = child;
        
      }
    });
  });

  return foundNode;
}

"use client";
import VisualDB from "./VisualDB";
import { useState } from "react";

import NodeEditSheet from "./components/NodeEditSheet.jsx";

export default function page() {
  const [selectedNode, setSelectedNode] = useState(null);
  console.log(selectedNode);

  return (
    <>
        <VisualDB setSelectedNode={setSelectedNode} />

        {selectedNode && (
          <NodeEditSheet
            selectedNode={selectedNode}
            className="absolute top-0 left-0 bg-white  border border-gray-300 shadow-lg"
          />
        )}
    </>
  );
}

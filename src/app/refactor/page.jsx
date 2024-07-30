"use client";
import VisualDB from "./VisualDB";
import { useState } from "react";
import NodeEditSheet from "./components/NodeEditSheet.jsx";
import CreateRelations from "./components/CreateRelations";
import DeleteRelationSheet from "./components/DeleteRelationViaUUID";
import ModelSettings from './components/ModelSettings'


export default function page() {
  const [tb, setTb] = useState(null);
  const [map, setMap] = useState(null);
  const [nodeStateObj, setNodeStateObj] = useState({
    counter: 0,
    nodeA: null,
    nodeB: null,
    selectedNode: null,
  });

  console.log(nodeStateObj);

  return (
    <>
    <div>
    <VisualDB
        setNodeStateObj={setNodeStateObj}
        tb={tb}
        setTb={setTb}
        map={map}
        setMap={setMap}
      />

      {nodeStateObj.selectedNode && (
        <NodeEditSheet
          nodeStateObj={nodeStateObj}
          className="absolute top-0 left-0 bg-white  border border-gray-300 shadow-lg"
          map={map}
          tb={tb}
        />
      )}

      <ModelSettings map={map} tb={tb}/>

      <DeleteRelationSheet />
      
      <CreateRelations
        className={"absolute top-0 right-0 border border-gray-300 shadow-lg"}
        nodeStateObj={nodeStateObj}
        tb={tb}
        map={map}
      />
    </div>
      
    </>
  );
}

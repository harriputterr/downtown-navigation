"use client";
import VisualDB from "./VisualDB";
import { useState } from "react";
import NodeEditSheet from "./components/NodeEditSheet.jsx";
import CreateRelations from "./components/CreateRelations";
import DeleteRelationSheet from "./components/DeleteRelationViaUUID";
import ModelSettings from "./components/ModelSettings";

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
                <nav className="flex gap-5  fixed py-2 container  bg-black/50 top-0 inset-x-0 z-50">
                    <DeleteRelationSheet />
                    <ModelSettings map={map} tb={tb} />
                    <CreateRelations
                        nodeStateObj={nodeStateObj}
                        tb={tb}
                        map={map}
                    />
                    {nodeStateObj.selectedNode && (
                        <NodeEditSheet
                            className={"ml-auto"}
                            nodeStateObj={nodeStateObj}
                            map={map}
                            tb={tb}
                        />
                    )}
                </nav>
                <VisualDB
                    setNodeStateObj={setNodeStateObj}
                    tb={tb}
                    setTb={setTb}
                    map={map}
                    setMap={setMap}
                />
            </div>
        </>
    );
}

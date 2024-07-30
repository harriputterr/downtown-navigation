"use client";
import VisualDB from "./VisualDB";
import { useState } from "react";
import NodeEditSheet from "./components/NodeEditSheet.jsx";
import CreateRelations from "./components/CreateRelations";
import DeleteRelationSheet from "./components/DeleteRelationViaUUID";
import ModelSettings from "./components/ModelSettings";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
                <nav className=" gap-5  fixed py-2 container  bg-black/50 top-0 inset-x-0 z-50 hidden md:flex">
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

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="md:hidden fixed right-5 top-5 z-50">
                            Open Menu
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="md:hidden">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription></SheetDescription>
                        </SheetHeader>

                        <nav className=" flex flex-col gap-5 py-2 ">
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
                    </SheetContent>
                </Sheet>

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

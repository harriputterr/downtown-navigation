"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
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
import { queryDB } from "./QueryDB";
import { deleteDataNode } from "./DataNodeCRUD";
import { findObjectInWorldViaUUID } from "./FindObjectInWorld";
import FileUpload from "./FileUpload";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ImageRenderer from "@/components/ImageRenderer";
import { useToast } from "@/components/ui/use-toast";

export default function NodeEditSheet({ nodeStateObj, className, map, tb }) {
    const { toast } = useToast();
    const selectedNode = nodeStateObj.selectedNode;

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [name, setName] = useState("");
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

    const [camera, setCamera] = useState(null);
    const [controls, setControls] = useState(null);

    useEffect(() => {
        if (selectedNode) {
            setX(selectedNode.point.x);
            setY(selectedNode.point.y);
            setZ(selectedNode.point.z);
            setName(selectedNode.name);
        } else {
            setX(0);
            setY(0);
            setZ(0);
        }
    }, [selectedNode]);

    async function handleFileUpload(newFileUrl) {
        try {
            const query = `
    MATCH (n: Node {uuid: $uuid})
    SET n.image = $image
    RETURN n;
    `;
            const params = {
                image: newFileUrl,
                uuid: selectedNode.uuid,
            };
            await queryDB({
                query,
                type: "write",
                params,
            });

            return { success: true };
        } catch (err) {
            const query = `
    MATCH (n: Node {uuid: $uuid})
    SET n.image = $image
    RETURN n;
    `;
            const params = {
                image: null,
                uuid: selectedNode.uuid,
            };
            await queryDB({
                query,
                type: "write",
                params,
            });
            return { success: false, message: "Error while upadting DB" };
        }
    }

    async function handleSubmit() {
        const query = `
    MATCH (n: Node {uuid: $uuid})
    SET n.point = point({x: $x, y: $y, z: $z})
    SET n.name = $name
    RETURN n;
    `;
        const uuid = selectedNode.uuid;
        const params = { uuid, x, y, z, name };

        const result = await queryDB({
            query: query,
            type: "write",
            params: params,
        });

        let foundNode = findObjectInWorldViaUUID(uuid, tb);

        await foundNode.setCoords([x, y, z]);

        tb.update();
        map.repaint = true;
    }

    async function handleDelete() {
        // Deletes the Data node from the DB
        const deleteNodeUUID = selectedNode.uuid;
        deleteDataNode(deleteNodeUUID);

        // Removes the data node from the map.Specifically through the world array.
        const sphere = findObjectInWorldViaUUID(deleteNodeUUID, tb);
        tb.remove(sphere);

        tb.update();
        map.repaint = true;
    }

    function handleSaveInitialView() {
        if (cameraRef.current && controlsRef.current) {
            const cameraDirection = new THREE.Vector3();
            cameraRef.current.getWorldDirection(cameraDirection);
            console.log(cameraDirection);

            //     const lookAt = new THREE.Vector3(
            //       -0.9685079767749152,
            //       0.05840541811344151,
            //       -0.2420353405152943
            //     );

            //     console.log("This is the lookat",lookAt)
            //   //   {
            //   //     "x": -0.9685079767749152,
            //   //     "y": 0.05840541811344151,
            //   //     "z": -0.2420353405152943
            //   // }

            //     console.log(cameraDirection)

            //     cameraRef.current.lookAt(lookAt)

            //     controlsRef.current.target.copy(lookAt);
            //     controlsRef.current.update();

            // console.log(cameraRef.current)
            toast({
                title: "Camera Direction",
                description: JSON.stringify(cameraDirection),
            });
        }
    }

    function handleViewSave({ camera, controls }) {
        console.log(camera, controls);
    }

    return (
        <Sheet>
            <SheetTrigger className={className} asChild>
                <Button variant="outline">Edit Node</Button>
            </SheetTrigger>
            <SheetContent className=" overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Edit Node</SheetTitle>
                    <SheetDescription>
                        Make changes to your Node here. Click save when you are
                        done.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            className="col-span-3"
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="longitude" className="text-right">
                            Longitude | x
                        </Label>
                        <Input
                            type="number"
                            id="longitude"
                            value={x}
                            className="col-span-3"
                            onChange={(event) => {
                                if (event.target.value === "") {
                                    setX(0);
                                } else {
                                    setX(Number(event.target.value));
                                }
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="latitude" className="text-right">
                            Latitude | y
                        </Label>
                        <Input
                            type="number"
                            id="latitude"
                            value={y}
                            className="col-span-3"
                            onChange={(event) => {
                                setY(Number(event.target.value));
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="height" className="text-right">
                            Height | z
                        </Label>
                        <Input
                            type="number"
                            id="height"
                            value={z}
                            className="col-span-3"
                            onChange={(event) => {
                                setZ(Number(event.target.value));
                            }}
                        />
                    </div>

                    {/* TODO: give a file source */}
                    <FileUpload
                        id={selectedNode.uuid}
                        label="Image"
                        width={300}
                        objectKey={selectedNode.uuid}
                        fileSource={
                            selectedNode.image || uploadedFileUrl || null
                        }
                        saveFileInDbAction={handleFileUpload}
                        onFileUpload={({ url }) => {
                            setUploadedFileUrl(url);
                        }}
                    />

                    {(selectedNode.image || uploadedFileUrl) && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"secondary"}>
                                    Set Initial view for image
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="p-0 overflow-hidden inset-0 translate-x-0 translate-y-0 max-w-[100vw]">
                                <ImageRenderer
                                    image={
                                        uploadedFileUrl || selectedNode.image
                                    }
                                    isInitViewEdittable={true}></ImageRenderer>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick={handleSubmit} type="submit">
                            Save changes
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

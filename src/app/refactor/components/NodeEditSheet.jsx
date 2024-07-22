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

export default function NodeEditSheet({ nodeStateObj, className }) {

  const selectedNode = nodeStateObj.selectedNode;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    if (selectedNode) {
      setX(selectedNode.point.x);
      setY(selectedNode.point.y);
      setZ(selectedNode.point.z);
    } else {
      setX(0);
      setY(0);
      setZ(0);
    }
  }, [selectedNode]);

  async function handleSubmit() {

    const query = `
    MATCH (n: Node {uuid: $uuid})
    SET n.point = point({x: $x, y: $y, z: $z})
    RETURN n;
    `
    const uuid = selectedNode.uuid;
    const params = { uuid, x, y, z };

    const result = await queryDB({
      query: query,
      type: "write",
      params: params,
    });

    console.log(result)
  }

  return (
    <Sheet>
      <SheetTrigger className={className} asChild>
        <Button variant="outline">Edit Node</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>
            Make changes to your Node here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
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
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Color
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div> */}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSubmit} type="submit">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet >
  );
}

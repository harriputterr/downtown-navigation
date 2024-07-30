"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { queryDB } from "./QueryDB";

export default function DeleteRelationSheet({ className }) {
    const [uuid, setUuid] = useState("");

    async function handleClick() {
        const query = `
    MATCH ()-[r {uuid: $uuid}]-()
    DELETE r
  `;
        const params = { uuid };

        try {
            const result = await queryDB({ query, type: "write", params });
            return {
                success: true,
                message: "Relationship deleted successfully",
                result,
            };
        } catch (error) {
            console.error("Error deleting relationship:", error);
            return {
                success: false,
                message: "Error deleting relationship",
                error,
            };
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"outline"} className={className}>
                    Delete Relation
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Delete Relation</SheetTitle>
                    <SheetDescription>
                        Delete the relation via UUID
                    </SheetDescription>
                </SheetHeader>
                <div className={`grid gap-4 py-4`}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="relation-uuid" className="text-right">
                            Relation UUID
                        </Label>
                        <Input
                            id="relation-uuid"
                            value={uuid}
                            className="col-span-3"
                            onChange={(event) => setUuid(event.target.value)}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="destructive" onClick={handleClick}>
                            Delete
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

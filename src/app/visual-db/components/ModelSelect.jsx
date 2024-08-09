import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { data } from "@/app/visual-db/prototype-structure-data/modelData";

export default function ModelSelect({ setModelId }) {
    return (
        <Select
            onValueChange={(value) => {
                setModelId(value);
            }}>
            <SelectTrigger>
                <SelectValue placeholder="Select a Model" />
            </SelectTrigger>
            <SelectContent>
                <div className="pl-3">
                    <SelectItem value="all">Apply to all</SelectItem>
                </div>

                <SelectGroup>
                    <SelectLabel>Building models</SelectLabel>

                    <div className="pl-3">
                        {data.buildings.map((building) => (
                            <SelectItem key={building.id} value={building.id}>
                                {building.name}
                            </SelectItem>
                        ))}
                    </div>
                </SelectGroup>

                <SelectGroup>
                    <SelectLabel>Main Floor models</SelectLabel>

                    <div className="pl-3">
                        {data.mainFloors.map((floor) => (
                            <SelectItem key={floor.id} value={floor.id}>
                                {floor.name}
                            </SelectItem>
                        ))}
                    </div>
                </SelectGroup>

                <SelectGroup>
                    <SelectLabel>plus15 models</SelectLabel>

                    <div className="pl-3">
                        {data.plus15Floors.map((floor) => (
                            <SelectItem key={floor.id} value={floor.id}>
                                {floor.name}
                            </SelectItem>
                        ))}
                    </div>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

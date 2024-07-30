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

export default function ModelSelect({ setModelId }) {
  return (
    <Select
      onValueChange={(value) => {
        setModelId(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xl">Building Models</SelectLabel>
          <SelectItem value="sec">Suncor-Energy-Center</SelectItem>
          <SelectItem value="bvs">Bow-Valley-Square</SelectItem>
          <SelectItem value="tel-han">Telus-Sky-And-Hanover</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-xl">Main Floor Models</SelectLabel>
          <SelectItem value="sec-m">Suncor-Main-Floor</SelectItem>
          <SelectItem value="bvs-m">BVS-Main-Floor</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-xl">Plus 15 Models</SelectLabel>
          <SelectItem value="sec-p">Suncor-Plus15-Floor</SelectItem>
          <SelectItem value="bvs-p">BVS-Plus-15-Floor</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

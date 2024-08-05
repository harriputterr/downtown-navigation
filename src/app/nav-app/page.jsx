"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchBox } from "./components/SearchBox";
import { getAllNodes } from "@/utils/nodeUtils";
import ImageDisplay from "./components/ImageDisplay";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Page() {
  const mapboxRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const mapRef = useRef(null);
  console.log(to)
  useEffect(() => {
    if (from && to && nodes && mapRef.current) {
      console.log(nodes)
      const fromNode = nodes.find((node) => node.name == from);
      const toNode = nodes.find((node) => node.name == to);
      const fromMarker = new mapboxgl.Marker()
        .setLngLat([fromNode.point.x, fromNode.point.y])
        .addTo(mapRef.current);

      fromMarker.getElement().addEventListener("click", (e) => {
        console.log("marker is clicked!", e);
      });

      const toMarker = new mapboxgl.Marker()
        .setLngLat([toNode.point.x, toNode.point.y])
        .addTo(mapRef.current);
    }
  }, [from, to]);

  useEffect(() => {
    getAllNodes().then((res) => {
      const data = res.data.map((ele) => ele.n.properties);
      console.log(data)
      setNodes(data);
    });
    if (mapboxRef.current) {
      const map = new mapboxgl.Map({
        container: mapboxRef.current,
        style: "mapbox://styles/mapbox/light-v9",
        center: [-114.063775, 51.0475053],
        zoom: 16,
        antialias: true,
      });

      mapRef.current = map;

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        showAccuracyCircle: false,
        trackUserLocation: true,
        //   showUserHeading: true,
      });

      map.addControl(geolocate);

      return () => {
        map.remove(); // Clean up on unmount
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    // <div className="w-96 h-96">
      // {/* {from && to ? (
      //   <ImageDisplay from={from} to={to} />
      // ) : (

    //   )} */}
    //   <div ref={mapboxRef} className="w-screen h-screen"></div>
    //   <div className="flex flex-col gap-2 absolute top-5 right-5 min-w-[15rem]">
    //     <SearchBox
    //       placeholder="From"
    //       elements={nodes}
    //       onSelectChange={(val) => {
    //         setFrom(val);
    //       }}
    //     />
    //     <SearchBox
    //       placeholder="To"
    //       elements={nodes}
    //       onSelectChange={(val) => {
    //         setTo(val);
    //       }}
    //     />
    //   </div>
    // </div>
    <>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-screen w-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            <div ref={mapboxRef} className="w-screen h-screen"></div>
            <div className="flex flex-col gap-2 absolute top-5 right-5 min-w-[15rem]">
              <SearchBox
                placeholder="From"
                elements={nodes}
                onSelectChange={(val) => {
                  setFrom(val);
                }}
              />
              <SearchBox
                placeholder="To"
                elements={nodes}
                onSelectChange={(val) => {
                  setTo(val);
                }}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            { from && to ? <ImageDisplay from={from} to={to}/> : <div>Select a route to get started</div> }
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

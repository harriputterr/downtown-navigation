"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchBox } from "./components/SearchBox";
import { getAllNodes } from "@/utils/nodeUtils";
import ImageDisplay from "./components/ImageDisplay";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Page() {
    const mapboxRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    useEffect(() => {
        if (mapboxRef.current) {
            const map = new mapboxgl.Map({
                container: mapboxRef.current,
                style: "mapbox://styles/mapbox/light-v9",
                center: [-114.063775, 51.0475053],
                zoom: 16,
                antialias: true,
            });

            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                showAccuracyCircle: false,
                trackUserLocation: true,
                //   showUserHeading: true,
            });

            getAllNodes().then((res) => {
                const data = res.data.map((ele) => ele.n.properties);
                setNodes(data);
            });

            map.addControl(geolocate);

            return () => {
                map.remove(); // Clean up on unmount
            };
        }
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div className="w-96 h-96">
            {/* <div ref={mapboxRef} className="w-screen h-screen"></div>;
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
            </div> */}
             <ImageDisplay />
        </div>
    );
}

"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "./components/SearchBox";
import { getAllNodes, getShortestPathNodes } from "@/utils/nodeUtils";
import ImageDisplay from "./components/ImageDisplay";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Page() {
    const mapboxRef = useRef(null);
    const [routeNodes, setRouteNodes] = useState([]);
    const [allNodes, setAllNodes] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);

    async function setShortestPathNodes({ from, to }) {
        const resNodes = await getShortestPathNodes({ from, to });
        setRouteNodes(resNodes);
    }

    useEffect(() => {
        if (from && to) {
            markers.map((marker) => marker.remove());
            setShortestPathNodes({ from, to });
        }
    }, [from, to]);

    useEffect(() => {
        if (routeNodes.length > 0) {
            const selectedNode = routeNodes[selectedNodeIdx];

            const marker = new mapboxgl.Marker()
                .setLngLat([selectedNode.point.x, selectedNode.point.y])
                .addTo(mapRef.current);
            setMarkers((prev) => [...prev, marker]);
            return () => {
                marker.remove();
            };
        }
    }, [selectedNodeIdx, routeNodes.length]);

    useEffect(() => {
        if (from && to && routeNodes.length > 0 && mapRef.current) {
            const fromNode = routeNodes.find((node) => node.name == from);
            const toNode = routeNodes.find((node) => node.name == to);

            const fromMarker = new mapboxgl.Marker()
                .setLngLat([fromNode.point.x, fromNode.point.y])
                .addTo(mapRef.current);
            fromMarker.getElement().innerHTML =
                "<div class='outline outline-green-500 outline-offset-2 bg-green-500 p-1 w-2 h-2 rounded-full'></div>";

            const toMarker = new mapboxgl.Marker()
                .setLngLat([toNode.point.x, toNode.point.y])
                .addTo(mapRef.current);
            toMarker.getElement().innerHTML =
                "<div class='outline outline-red-400 outline-offset-2 bg-red-400 p-1 w-2 h-2 rounded-full'></div>";

            setMarkers((prev) => [...prev, fromMarker, toMarker]);

            [...routeNodes].splice(1, routeNodes.length - 2).map((node) => {
                const marker = new mapboxgl.Marker({
                    scale: 0.5,
                })
                    .setLngLat([node.point.x, node.point.y])
                    .addTo(mapRef.current);
                marker.getElement().innerHTML =
                    "<div class='outline outline-blue-400 outline-offset-2 bg-blue-400 p-1 w-2 h-2 rounded-full'></div>";
                setMarkers((prev) => [...prev, marker]);
            });
        }
    }, [routeNodes.length]);

    useEffect(() => {
        getAllNodes().then((res) => {
            const data = res.data.map((ele) => ({
                ...ele.n.properties,
                name: ele.n.properties.name.toLowerCase(),
            }));
            setAllNodes(data);
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
        <>
            <ResizablePanelGroup
                direction="vertical"
                className="w-screen rounded-lg border min-h-100vh min-h-[100svh]">
                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center">
                        <div
                            ref={mapboxRef}
                            className="w-screen h-screen"></div>
                        <div className="flex flex-col gap-2 absolute top-5 right-5 min-w-[15rem]">
                            <SearchBox
                                placeholder="From"
                                elements={allNodes}
                                onSelectChange={(val) => {
                                    setFrom(val);
                                }}
                            />
                            <SearchBox
                                placeholder="To"
                                elements={allNodes}
                                onSelectChange={(val) => {
                                    setTo(val);
                                }}
                            />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className="relative">
                    <div className="flex h-full items-center justify-center">
                        {from && to ? (
                            <ImageDisplay
                                selectedNodeIdx={selectedNodeIdx}
                                setSelectedNodeIdx={setSelectedNodeIdx}
                                nodes={routeNodes}
                            />
                        ) : (
                            <div>Select a route to get started</div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}

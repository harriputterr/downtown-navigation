"use client";
import { queryDB } from "@/app/refactor/components/QueryDB";
import ImageRenderer from "@/components/ImageRenderer";
import { useEffect, useState } from "react";

export default function ImageDisplay({ from, to }) {
    // State to manage the currently displayed image index
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => {
            if (prev < images.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => {
            if (prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    };

    async function getShortestPathImageUrls() {
        const query = `
      MATCH (startNode:Node {name: $start}), (endNode:Node {name: $stop})
      MATCH path = shortestPath((startNode)-[*]-(endNode))
      RETURN nodes(path) AS pathNodes;
    `;

        const result = await queryDB({
            query,
            type: "read",
            params: { start: from, stop: to },
        });

        if (result.data.length === 0) {
            console.log("No data found");
            return;
        }

        const nodesArray = result.data[0].pathNodes;

        const imagesURL = nodesArray.map((node) => {
            return node.properties.image;
        });

        const imagesObj = imagesURL.map((imageURL) => {
            if (!imageURL) {
                return {
                    imageURL:
                        "https://placehold.co/600x400?text=No+Image+to+display",
                    initialView: { lon: 0, lat: 0 },
                };
            }
            return {
                imageURL,
                initialView: { lon: 0, lat: 0 },
            };
        });

        setImages(imagesObj);
    }

    useEffect(() => {
        getShortestPathImageUrls();
    }, []);

    if (images.length === 0) {
        return "loading....";
    }

    return (
        <div>
            <ImageRenderer image={images[currentImageIndex].imageURL} />
            <button
                onClick={handlePrevImage}
                id="leftArrow"
                className="arrow hover:bg-gray-700 hover:text-white">
                ←
            </button>
            <button
                onClick={handleNextImage}
                id="rightArrow"
                className="arrow hover:bg-gray-700 hover:text-white ">
                →
            </button>
        </div>
    );
}

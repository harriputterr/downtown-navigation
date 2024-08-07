"use client";
import ImageRenderer from "@/components/ImageRenderer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

export default function ImageDisplay({
    nodes,
    selectedNodeIdx,
    setSelectedNodeIdx,
}) {
    // State to manage the currently displayed image index
    const [images, setImages] = useState([]);

    const handleNextImage = () => {
        setSelectedNodeIdx((prev) => {
            if (prev < images.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handlePrevImage = () => {
        setSelectedNodeIdx((prev) => {
            if (prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    };

    useEffect(() => {
        const imagesURL = nodes.map((node) => node.image);

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

        console.log("imagesObj", imagesObj);

        setImages(imagesObj);
    }, [nodes]);

    if (images.length === 0) {
        return "loading....";
    }

    return (
        <div>
            <ImageRenderer image={images[selectedNodeIdx].imageURL} />

            <div className="absolute"></div>

            <div className="flex gap-3 absolute bottom-3 right-3 md:hidden">
                <Button
                    disabled={selectedNodeIdx === 0}
                    onClick={handlePrevImage}>
                    <IoIosArrowRoundBack className="text-4xl" />
                </Button>
                <Button
                    disabled={selectedNodeIdx === images.length - 1}
                    onClick={handleNextImage}>
                    <IoIosArrowRoundForward className="text-4xl" />
                </Button>
            </div>

            <button
                disabled={selectedNodeIdx === 0}
                onClick={handlePrevImage}
                className="absolute pl-6 pr-32 inset-y-0 left-0  place-content-center hover:bg-black/10 focus:bg-black/10 group disabled:hidden transition-colors hidden md:grid">
                <span className="text-7xl text-white opacity-0 translate-x-6 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 group-hover:translate-x-0 transition-all">
                    <IoIosArrowRoundBack />
                </span>
            </button>

            <button
                disabled={selectedNodeIdx === images.length - 1}
                onClick={handleNextImage}
                className="absolute pr-6 pl-32 inset-y-0 right-0  place-content-center hover:bg-black/10 focus:bg-black/10 group disabled:hidden transition-colors hidden md:grid">
                <span className="text-7xl text-white opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0  group-focus:translate-x-0 group-focus:opacity-100 transition-all ">
                    <IoIosArrowRoundForward />
                </span>
            </button>
        </div>
    );
}

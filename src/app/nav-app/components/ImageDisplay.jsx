"use client";
import { queryDB } from "@/app/refactor/components/QueryDB";
import ImageRenderer from "@/components/ImageRenderer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

export default function ImageDisplay({ from, to }) {
  // State to manage the currently displayed image index
  const [imagesObj, setImagesObj] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      if (prev < imagesObj.length - 1) {
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

    const imagesWithInitView = nodesArray.map((node) => {
      const { image, initX, initY, initZ } = node.properties;
      return { imageURL: image, initView: { initX, initY, initZ } };
    });

    const imagesObjWithInitViews = imagesWithInitView.map((imgWithView) => {
      if (!imgWithView.imageURL) {
        return {
          imageURL: "https://placehold.co/600x400?text=No+Image+to+display",
          initView: { ...imgWithView.initView },
        };
      }
      return imgWithView;
    });

    setImagesObj(imagesObjWithInitViews);
  }

  useEffect(() => {
    getShortestPathImageUrls();
  }, []);

  useEffect(() => {
    console.log("IMAGES OBJ: ",imagesObj)
  }, [imagesObj])
  if (imagesObj.length === 0) {
    return "loading....";
  }

  return (
    <div>
      <ImageRenderer image={imagesObj[currentImageIndex].imageURL} initView={imagesObj[currentImageIndex].initView} />

      <div className="absolute"></div>

      <div className="flex gap-3 absolute bottom-3 right-3 md:hidden">
        <Button disabled={currentImageIndex === 0} onClick={handlePrevImage}>
          <IoIosArrowRoundBack className="text-4xl" />
        </Button>
        <Button
          disabled={currentImageIndex === imagesObj.length - 1}
          onClick={handleNextImage}
        >
          <IoIosArrowRoundForward className="text-4xl" />
        </Button>
      </div>

      <button
        disabled={currentImageIndex === 0}
        onClick={handlePrevImage}
        className="absolute pl-6 pr-32 inset-y-0 left-0  place-content-center hover:bg-black/10 focus:bg-black/10 group disabled:hidden transition-colors hidden md:grid"
      >
        <span className="text-7xl text-white opacity-0 translate-x-6 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 group-hover:translate-x-0 transition-all">
          <IoIosArrowRoundBack />
        </span>
      </button>

      <button
        disabled={currentImageIndex === imagesObj.length - 1}
        onClick={handleNextImage}
        className="absolute pr-6 pl-32 inset-y-0 right-0  place-content-center hover:bg-black/10 focus:bg-black/10 group disabled:hidden transition-colors hidden md:grid"
      >
        <span className="text-7xl text-white opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0  group-focus:translate-x-0 group-focus:opacity-100 transition-all ">
          <IoIosArrowRoundForward />
        </span>
      </button>
    </div>
  );
}

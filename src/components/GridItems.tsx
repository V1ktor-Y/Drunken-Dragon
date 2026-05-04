import testImage from "../assets/hero.png";
import Droppable from "./Droppable";
import { useState } from "react";
import PlayAreaToken from "./PlayAreaToken";

interface Props {
  panX: number;
  panY: number;
  gridSize: number;
}

function GridItems({ gridSize }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const gridItemData = [
    {
      gridX: 0,
      gridY: 0,
      image_source: testImage,
    },
    {
      gridX: 2,
      gridY: 1,
      image_source: testImage,
    },
    {
      gridX: -2,
      gridY: -1,
      image_source: testImage,
    },
  ];

  return (
    <>
      {gridItemData.map((item) => {
        return (
          <PlayAreaToken
            image_source={testImage}
            gridSize={gridSize}
            gridX={item.gridX}
            gridY={item.gridY}
          ></PlayAreaToken>
        );
      })}
    </>
  );
}
export default GridItems;

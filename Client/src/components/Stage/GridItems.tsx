import imgA from "../../assets/ball.jpg";
import imgB from "../../assets/hornet.jpg";
import imgC from "../../assets/joy.jpg";
import PlayAreaToken from "./PlayAreaToken";

interface Props {
  panX: number;
  panY: number;
  gridSize: number;
}

function GridItems({ gridSize, panX, panY }: Props) {
  const gridItemData = [
    {
      id: 0,
      gridX: 0,
      gridY: 0,
      image_source: imgA,
    },
    {
      id: 1,
      gridX: 2,
      gridY: 1,
      image_source: imgB,
    },
    {
      id: 2,
      gridX: -2,
      gridY: -1,
      image_source: imgC,
    },
  ];

  return (
    <>
      {gridItemData.map((item) => {
        return (
          <PlayAreaToken
            key={item.id}
            image_source={item.image_source}
            gridSize={gridSize}
            gridX={item.gridX}
            gridY={item.gridY}
            panX={panX}
            panY={panY}
          ></PlayAreaToken>
        );
      })}
    </>
  );
}
export default GridItems;

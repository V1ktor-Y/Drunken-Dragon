import imgA from "../../assets/ball.jpg";
import imgB from "../../assets/hornet.jpg";
import imgC from "../../assets/joy.jpg";
import PlayAreaToken from "./PlayAreaToken";
import type { PlacedToken } from "../../types/tokens";

interface Props {
  panX: number;
  panY: number;
  gridSize: number;
  placedTokens: PlacedToken[];
  activeTokenInstanceId: string | null;
  onSelectToken: (tokenId: string) => void;
  onDeletePlacedToken: (tokenInstanceId: string) => void;
  onTokenDragStateChange: (isDragging: boolean, clientX?: number) => void;
  isPointInTrashZone: (clientX: number, clientY: number) => boolean;
}

function GridItems({
  gridSize,
  panX,
  panY,
  placedTokens,
  activeTokenInstanceId,
  onSelectToken,
  onDeletePlacedToken,
  onTokenDragStateChange,
  isPointInTrashZone,
}: Props) {
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
            imageSource={item.image_source}
            name={`Token ${item.id + 1}`}
            gridSize={gridSize}
            gridX={item.gridX}
            gridY={item.gridY}
            panX={panX}
            panY={panY}
          ></PlayAreaToken>
        );
      })}
      {placedTokens.map((token) => (
        <PlayAreaToken
          key={token.instanceId}
          tokenInstanceId={token.instanceId}
          tokenId={token.id}
          isActive={token.instanceId === activeTokenInstanceId}
          imageSource={token.imageSource}
          name={token.name}
          gridSize={gridSize}
          gridX={token.gridX}
          gridY={token.gridY}
          panX={panX}
          panY={panY}
          onSelect={onSelectToken}
          onDelete={onDeletePlacedToken}
          onDragStateChange={onTokenDragStateChange}
          isPointInTrashZone={isPointInTrashZone}
        />
      ))}
    </>
  );
}
export default GridItems;

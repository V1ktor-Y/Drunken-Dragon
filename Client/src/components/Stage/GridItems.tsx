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
  return (
    <>
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

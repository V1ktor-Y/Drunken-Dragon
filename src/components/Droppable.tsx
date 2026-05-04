interface Props {
  gridSize: number;
  gridX: number;
  gridY: number;
}

function Droppable({ gridSize, gridX, gridY }: Props) {
  return (
    <div
      style={{
        width: gridSize,
        height: gridSize,
        backgroundColor: "cornflowerblue",
        position: "absolute",
        left: gridX * gridSize,
        top: gridY * gridSize,
        opacity: 0.5,
      }}
    ></div>
  );
}

export default Droppable;

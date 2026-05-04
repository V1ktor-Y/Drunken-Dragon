import { useState, type ReactNode } from "react";

interface Props {
  id: string;
  gridSize: number;
  children?: ReactNode;
}

function Droppable({ children, gridSize }: Props) {
  return (
    <div
      style={{
        width: gridSize,
        height: gridSize,
        backgroundColor: "cornflowerblue",
      }}
    >
      {children}
    </div>
  );
}

export default Droppable;

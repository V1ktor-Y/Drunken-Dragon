import { useDroppable } from "@dnd-kit/react";

function Droppable(id: any, children: any) {
  const { ref } = useDroppable({ id });

  return (
    <div ref={ref} style={{ width: 100, height: 100 }}>
      {children}
    </div>
  );
}

export default Droppable;

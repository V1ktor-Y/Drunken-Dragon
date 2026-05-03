import { useDraggable } from "@dnd-kit/react";

interface Props {
  image_source: string;
  id: number;
  gridX: number;
  gridY: number;
  text: string;
}

function Draggable({ image_source }: Props) {
  const { ref } = useDraggable({
    id: "draggable",
  });

  return <img src={image_source} ref={ref} height={100} />;
}

export default Draggable;

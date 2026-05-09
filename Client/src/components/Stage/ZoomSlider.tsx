interface Props {
  gridSize: number;
  min: number;
  max: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (gridSize: number) => void;
}

export function ZoomSlider({
  gridSize,
  min,
  max,
  onZoomIn,
  onZoomOut,
  onZoomChange,
}: Props) {
  return (
    <section className="zoom-slider" aria-label="Grid zoom controls">
      <button className="zoom-button" type="button" onClick={onZoomIn}>
        +
      </button>
      <input
        className="zoom-range"
        type="range"
        min={min}
        max={max}
        value={gridSize}
        onChange={(event) => onZoomChange(Number(event.currentTarget.value))}
        aria-label="Grid cell size"
      />
      <button className="zoom-button" type="button" onClick={onZoomOut}>
        -
      </button>
    </section>
  );
}

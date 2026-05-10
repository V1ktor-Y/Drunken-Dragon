export type StoredMap = {
  id: number;
  name: string;
  filePath: string;
};

export type GameFieldMap = StoredMap & {
  src: string;
  widthCells: number;
  heightCells: number;
  gridX: number;
  gridY: number;
};

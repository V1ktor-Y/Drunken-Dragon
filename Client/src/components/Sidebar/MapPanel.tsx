import { useCallback, useEffect, useRef, useState } from "react";
import type { GameFieldMap, StoredMap } from "../../types/maps";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
const API_ORIGIN = API_BASE_URL.replace(/\/+$/, "");
const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";
const AUTH_CHANGED_EVENT = "drunkenDragon:authChanged";

function getImageUrl(filePath: string) {
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${API_ORIGIN}${normalizedPath}`;
}

async function parseResponseError(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;

  try {
    const error = JSON.parse(text) as unknown;
    if (error && typeof error === "object" && "title" in error) {
      return String(error.title);
    }
  } catch {
    return text;
  }

  return fallback;
}

interface MapPanelProps {
  gameFieldMaps: GameFieldMap[];
  onAddMapToField: (map: StoredMap, src: string) => void;
  onRemoveMapFromField: (mapId: number) => void;
  onUpdateGameFieldMap: (mapId: number, updates: Partial<GameFieldMap>) => void;
}

interface MapGridControlProps {
  label: string;
  min?: number;
  value: number;
  onChange: (value: number) => void;
}

function getGridValue(value: number, min?: number) {
  if (!Number.isFinite(value)) return min ?? 0;
  return min === undefined ? value : Math.max(min, value);
}

function MapGridControl({ label, min, value, onChange }: MapGridControlProps) {
  const updateValue = (nextValue: number) => {
    onChange(getGridValue(nextValue, min));
  };

  return (
    <label className="map-field-control">
      <span>{label}</span>
      <div>
        <button type="button" onClick={() => updateValue(value - 1)}>
          -
        </button>
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => updateValue(Number(event.currentTarget.value))}
        />
        <button type="button" onClick={() => updateValue(value + 1)}>
          +
        </button>
      </div>
    </label>
  );
}

export function MapPanel({
  gameFieldMaps,
  onAddMapToField,
  onRemoveMapFromField,
  onUpdateGameFieldMap,
}: MapPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [maps, setMaps] = useState<StoredMap[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadMaps = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!token) {
      setMaps([]);
      setStatus("Log in to load maps.");
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/Maps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          await parseResponseError(response, "Failed to load maps."),
        );
      }

      setMaps((await response.json()) as StoredMap[]);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to load maps.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadTimeout = window.setTimeout(() => void loadMaps(), 0);

    window.addEventListener(AUTH_CHANGED_EVENT, loadMaps);
    return () => {
      window.clearTimeout(loadTimeout);
      window.removeEventListener(AUTH_CHANGED_EVENT, loadMaps);
    };
  }, [loadMaps]);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      setStatus("Log in before adding maps.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    setIsUploading(true);
    setStatus("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/Maps/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          await parseResponseError(response, "Failed to add image."),
        );
      }

      const uploadedMap = (await response.json()) as StoredMap;
      setMaps((currentMaps) => [...currentMaps, uploadedMap]);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to add image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="maps-panel" aria-label="Maps">
      <div className="maps-list">
        {maps.map((map) => {
          const activeMap = gameFieldMaps.find(
            (gameFieldMap) => gameFieldMap.id === map.id,
          );

          return (
            <article className="map-card" key={map.id}>
              <img src={getImageUrl(map.filePath)} alt={map.name} />
              <div className="map-card-actions">
                {activeMap ? (
                <>
                  <div className="map-field-controls">
                    <MapGridControl
                      label="W"
                      min={1}
                      value={activeMap.widthCells}
                      onChange={(widthCells) =>
                        onUpdateGameFieldMap(activeMap.id, { widthCells })
                      }
                    />
                    <MapGridControl
                      label="H"
                      min={1}
                      value={activeMap.heightCells}
                      onChange={(heightCells) =>
                        onUpdateGameFieldMap(activeMap.id, { heightCells })
                      }
                    />
                    <MapGridControl
                      label="X"
                      value={activeMap.gridX}
                      onChange={(gridX) =>
                        onUpdateGameFieldMap(activeMap.id, { gridX })
                      }
                    />
                    <MapGridControl
                      label="Y"
                      value={activeMap.gridY}
                      onChange={(gridY) =>
                        onUpdateGameFieldMap(activeMap.id, { gridY })
                      }
                    />
                  </div>
                  <button
                    className="command-button map-field-action"
                    type="button"
                    onClick={() => onRemoveMapFromField(activeMap.id)}
                  >
                    Remove from game field
                  </button>
                </>
              ) : (
                <button
                  className="command-button map-field-action"
                  type="button"
                  onClick={() => onAddMapToField(map, getImageUrl(map.filePath))}
                >
                  Add to game field
                </button>
              )}
              </div>
            </article>
          );
        })}
        {!isLoading && maps.length === 0 && (
          <p className="maps-empty">{status}</p>
        )}
      </div>
      {status && maps.length > 0 && <p className="maps-status">{status}</p>}
      <div className="maps-footer">
        <button
          className="command-button maps-add-button"
          type="button"
          onClick={handleAddImage}
          disabled={isUploading}
        >
          Add Image
        </button>
        <input
          ref={fileInputRef}
          className="maps-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";

type NoteResponse = {
  content: string;
};

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

async function parseApiError(response: Response, fallback: string) {
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

export function NotesPanel() {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasUnsavedChanges = content !== savedContent;

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setSavedContent("");
      setStatus("Log in to save notes.");
      return;
    }

    let ignoreResult = false;

    async function loadNote() {
      setIsLoading(true);
      setStatus("Loading note...");

      try {
        const response = await fetch(`${API_BASE_URL}/api/Notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(await parseApiError(response, "Failed to load note."));
        }

        const data = (await response.json()) as NoteResponse;

        if (!ignoreResult) {
          setContent(data.content ?? "");
          setSavedContent(data.content ?? "");
          setStatus("");
        }
      } catch (error) {
        if (!ignoreResult) {
          setStatus(error instanceof Error ? error.message : "Failed to load note.");
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }

    void loadNote();

    return () => {
      ignoreResult = true;
    };
  }, []);

  const handleSave = async () => {
    const token = getAuthToken();

    if (!token) {
      setStatus("Log in to save notes.");
      return;
    }

    setIsSaving(true);
    setStatus("Saving note...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/Notes`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to save note."));
      }

      setSavedContent(content);
      setStatus("Note saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="notes-panel" aria-label="Notes">
      <h2>Notes</h2>
      <div className="notes-card">
        <textarea
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          disabled={isLoading}
          placeholder="Write encounter notes..."
          aria-label="Note content"
        />
        <div className="notes-actions">
          <span
            className="notes-info"
            tabIndex={0}
            aria-label="One saved note is kept per account. Saving replaces the previous note."
          >
            ?
            <span className="notes-tooltip" role="tooltip">
              One saved note is kept per account. Saving replaces the previous note.
            </span>
          </span>
          <button
            className="notes-save-button"
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving || !hasUnsavedChanges}
          >
            {isSaving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
      {status && <p className="notes-status">{status}</p>}
    </section>
  );
}

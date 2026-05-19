import { useEffect, useRef, useState } from "react";
import type { SidebarToken, TokenDropRequestDetail } from "../../types/tokens";
import { saveTokenImage, deleteTokenImage } from "../../utils/indexedDB";
import classIcon from "../../assets/class-management-svgrepo-com.svg";
import acIcon from "../../assets/shield-svgrepo-com.svg";
import speedIcon from "../../assets/fast-forward-svgrepo-com.svg";
import sizeIcon from "../../assets/size-fullscreen-svgrepo-com.svg";
import initIcon from "../../assets/initiative-svgrepo-com.svg";
import notesIcon from "../../assets/note-sticky-svgrepo-com.svg";

interface Props extends SidebarToken {
  selectedTokenId: string | null;
  selectedTokenVersion: number;
  onTokenUpdate: (token: SidebarToken) => void;
  onTokenDelete: (tokenId: string) => void;
}

function isTokenEditTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        "input, textarea, select, button, .token-card-avatar, .token-detail-field",
      ),
    )
  );
}

export function TokenCard(props: Props) {
  const [expanded, setExpanded] = useState(false);

  const [localName, setLocalName] = useState(props.name);
  const [localHp, setLocalHp] = useState(props.hp);
  const [localAc, setLocalAc] = useState(props.ac);
  const [localType, setLocalType] = useState(props.type);
  const [localInit, setLocalInit] = useState(props.init);
  const [localSpeed, setLocalSpeed] = useState(props.speed);
  const [localSize, setLocalSize] = useState(props.size);
  const [localNote, setLocalNote] = useState(props.note ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const suppressCardClickRef = useRef(false);
  const dragStartRef = useRef<{
    pointerId: number;
    token: SidebarToken;
    preview: HTMLDivElement | null;
    origin: DOMRect;
    startX: number;
    startY: number;
  } | null>(null);

  useEffect(() => {
    if (expanded) return;

    setLocalName(props.name);
    setLocalHp(props.hp);
    setLocalAc(props.ac);
    setLocalType(props.type);
    setLocalInit(props.init);
    setLocalSpeed(props.speed);
    setLocalSize(props.size);
    setLocalNote(props.note ?? "");
  }, [
    expanded,
    props.ac,
    props.hp,
    props.init,
    props.name,
    props.note,
    props.size,
    props.speed,
    props.type,
  ]);

  useEffect(() => {
    if (props.selectedTokenId !== props.id) return;

    const openTimeout = window.setTimeout(() => {
      setExpanded(true);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);

    return () => window.clearTimeout(openTimeout);
  }, [props.id, props.selectedTokenId, props.selectedTokenVersion]);

  useEffect(() => {
    if (!expanded) return;

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (isTokenEditTarget(event.target)) return;
      setExpanded(false);
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [expanded]);

  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressCardClickRef.current) {
      event.stopPropagation();
      suppressCardClickRef.current = false;
      return;
    }

    if (expanded) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result !== "string") return;
        
        // Save the massive Base64 string directly into IndexedDB, completely bypassing localStorage
        const storageId = props.sourceTokenId ?? props.id;
        await saveTokenImage(storageId, reader.result);

        setAvatarPreview(reader.result);
        props.onTokenUpdate({
          ...getCurrentToken(),
          imageSource: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentToken = (): SidebarToken => ({
    id: props.id,
    name: localName,
    type: localType,
    hp: localHp,
    ac: localAc,
    speed: localSpeed,
    size: localSize,
    init: localInit,
    isEnemy: props.isEnemy,
    imageSource: avatarPreview ?? props.imageSource,
    sourceTokenId: props.sourceTokenId,
    baseName: props.baseName,
    note: localNote,
  });

  const movePreview = (preview: HTMLDivElement, clientX: number, clientY: number) => {
    preview.style.transform = `translate(${clientX - 32}px, ${clientY - 32}px)`;
  };

  const buildDragPreview = (token: SidebarToken, origin: DOMRect) => {
    const preview = document.createElement("div");
    preview.className = "token-drag-preview";
    if (token.imageSource) {
      preview.style.backgroundImage = `url(${token.imageSource})`;
    }
    preview.style.transform = `translate(${origin.left}px, ${origin.top}px)`;
    document.body.appendChild(preview);
    return preview;
  };

  const animatePreviewBack = (preview: HTMLDivElement, origin: DOMRect) => {
    preview.classList.add("token-drag-preview-returning");
    preview.style.transform = `translate(${origin.left}px, ${origin.top}px)`;
    window.setTimeout(() => preview.remove(), 180);
  };

  const handleSave = () => {
    props.onTokenUpdate(getCurrentToken());
    setExpanded(false);
  };

  const handleDelete = async () => {
    // If not a clone, delete the image from IndexedDB completely
    if (!props.sourceTokenId) {
      await deleteTokenImage(props.id);
    }
    props.onTokenDelete(props.id);
    setExpanded(false);
  };

  const handleAvatarPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    event.preventDefault();
    const origin = event.currentTarget.getBoundingClientRect();
    const token = getCurrentToken();

    dragStartRef.current = {
      pointerId: event.pointerId,
      token,
      preview: null,
      origin,
      startX: event.clientX,
      startY: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleAvatarPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStartRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (!dragState.preview) {
      const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
      if (distance < 4) return;
      dragState.preview = buildDragPreview(dragState.token, dragState.origin);
      suppressCardClickRef.current = true;
    }

    movePreview(dragState.preview, event.clientX, event.clientY);
  };

  const handleAvatarPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStartRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragState.preview) return;

    const dropEvent = new CustomEvent<TokenDropRequestDetail>("drunken-dragon-token-drop", {
      cancelable: true,
      detail: {
        token: dragState.token,
        clientX: event.clientX,
        clientY: event.clientY,
      },
    });
    const wasPlaced = !window.dispatchEvent(dropEvent);

    if (wasPlaced) {
      dragState.preview.remove();
      return;
    }

    animatePreviewBack(dragState.preview, dragState.origin);
  };

  const handleCardClick = () => {
    if (suppressCardClickRef.current) {
      suppressCardClickRef.current = false;
      return;
    }

    if (!expanded) {
      setExpanded(true);
    }
  };

  // Parse HP assuming format like "10/10" or "84/84"
  const [currentHpStr, maxHpStr] = localHp.split("/");
  const currentHp = parseInt(currentHpStr, 10) || 0;
  const maxHp = parseInt(maxHpStr, 10) || 1;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  const avatarImageSource = avatarPreview ?? props.imageSource;

  return (
    <article
      ref={cardRef}
      className={`token-card ${props.isEnemy ? "token-card-enemy" : ""}`}
      onClick={handleCardClick}
    >
      <div className="token-card-main">
        <div 
          className="token-card-avatar" 
          onPointerDown={handleAvatarPointerDown}
          onPointerMove={handleAvatarPointerMove}
          onPointerUp={handleAvatarPointerUp}
          onPointerCancel={handleAvatarPointerUp}
          style={avatarImageSource ? { backgroundImage: `url(${avatarImageSource})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: "grab" } : { cursor: "grab" }}
          onClick={handleAvatarClick}
          title={expanded ? "Drag to map or click to change picture" : "Drag token to the map"}
        >
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: "none" }} 
          />
        </div>
        <div className="token-card-info">
          {expanded ? (
            <input 
              type="text"
              className="token-name-input"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
          ) : (
            <h3>{localName}</h3>
          )}
          <div className="token-card-hp">
            <span className="hp-label">HP:</span>
            <div className="hp-bar-container">
              {expanded ? (
                <input 
                  type="text" 
                  className="token-hp-input" 
                  value={localHp} 
                  onChange={(e) => setLocalHp(e.target.value)} 
                />
              ) : (
                <span className="hp-text">{localHp}</span>
              )}
              <div className="hp-bar">
                <div className="hp-bar-fill" style={{ width: `${hpPercent}%` }} />
              </div>
            </div>
          </div>
          {expanded && (
            <div className="token-card-details">
              <label className="token-detail-field">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={classIcon} alt="Class" style={{ width: "16px", height: "16px" }} />
                  Class:
                </span>
                <input type="text" value={localType} onChange={(e) => setLocalType(e.target.value)} />
              </label>
              <label className="token-detail-field">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={acIcon} alt="AC" style={{ width: "16px", height: "16px" }} />
                  AC:
                </span>
                <input type="text" value={localAc} onChange={(e) => setLocalAc(e.target.value)} />
              </label>
              <label className="token-detail-field">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={speedIcon} alt="Speed" style={{ width: "16px", height: "16px" }} />
                  Speed:
                </span>
                <input type="text" value={localSpeed} onChange={(e) => setLocalSpeed(e.target.value)} />
              </label>
              <label className="token-detail-field">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={sizeIcon} alt="Size" style={{ width: "16px", height: "16px" }} />
                  Size:
                </span>
                <select value={localSize} onChange={(e) => setLocalSize(e.target.value)}>
                  <option value="SML">Small</option>
                  <option value="MED">Medium</option>
                  <option value="LRG">Large</option>
                  <option value="Humanoid">Humanoid</option>
                </select>
              </label>
              <label className="token-detail-field">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={initIcon} alt="Initiative" style={{ width: "16px", height: "16px" }} />
                  Init:
                </span>
                <input type="text" value={localInit} onChange={(e) => setLocalInit(e.target.value)} />
              </label>
              <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "8px" }}>
                <img src={notesIcon} alt="Notes" style={{ width: "16px", height: "16px", marginTop: "6px" }} />
                <textarea
                  className="token-notes"
                  placeholder="Notes..."
                  style={{ flex: 1 }}
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                />
              </div>
              <div className="token-actions">
                <button type="button" className="token-save-btn" onClick={handleSave}>Save Token</button>
                <button type="button" className="token-delete-btn" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <button 
        type="button" 
        className="token-toggle-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▲" : "▼"}
      </button>
    </article>
  );
}

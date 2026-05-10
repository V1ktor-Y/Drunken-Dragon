import { useState, useRef } from "react";

interface Props {
  name: string;
  type: string;
  hp: string;
  ac: string;
  speed: string;
  size: string;
  init: string;
  isEnemy: boolean;
}

export function TokenCard(props: Props) {
  const [expanded, setExpanded] = useState(false);

  const [localName, setLocalName] = useState(props.name);
  const [localHp, setLocalHp] = useState(props.hp);
  const [localSpeed, setLocalSpeed] = useState(props.speed);
  const [localSize, setLocalSize] = useState(props.size);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (expanded) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  // Parse HP assuming format like "10/10" or "84/84"
  const [currentHpStr, maxHpStr] = localHp.split("/");
  const currentHp = parseInt(currentHpStr, 10) || 0;
  const maxHp = parseInt(maxHpStr, 10) || 1;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  return (
    <article className={`token-card ${props.isEnemy ? "token-card-enemy" : ""}`}>
      <div className="token-card-main">
        <div 
          className="token-card-avatar" 
          style={avatarPreview ? { backgroundImage: `url(${avatarPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: expanded ? 'pointer' : 'default' } : { cursor: expanded ? 'pointer' : 'default' }}
          onClick={handleAvatarClick}
          title={expanded ? "Click to change picture" : undefined}
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
                <span>Speed:</span>
                <input type="text" value={localSpeed} onChange={(e) => setLocalSpeed(e.target.value)} />
              </label>
              <label className="token-detail-field">
                <span>Size:</span>
                <select value={localSize} onChange={(e) => setLocalSize(e.target.value)}>
                  <option value="SML">Small</option>
                  <option value="MED">Medium</option>
                  <option value="LRG">Large</option>
                  <option value="Humanoid">Humanoid</option>
                </select>
              </label>
              <textarea className="token-notes" placeholder="Notes..."></textarea>
              <div className="token-actions">
                <button type="button" className="token-save-btn" onClick={() => setExpanded(false)}>Save Token</button>
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
        {expanded ? "∧" : "∨"}
      </button>
    </article>
  );
}

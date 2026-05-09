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

export function TokenCard({
  name,
  type,
  hp,
  ac,
  speed,
  size,
  init,
  isEnemy,
}: Props) {
  return (
    <article className={`token-card ${isEnemy ? "token-card-enemy" : ""}`}>
      <div className="token-card-header">
        <div>
          <h3>{name}</h3>
          <p>{type}</p>
        </div>
        <strong className={isEnemy ? "stat-danger" : "stat-primary"}>
          HP {hp}
        </strong>
      </div>
      <dl className="token-stats">
        <div>
          <dt>AC</dt>
          <dd>{ac}</dd>
        </div>
        <div>
          <dt>Speed</dt>
          <dd>{speed}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{size}</dd>
        </div>
        <div>
          <dt>Init</dt>
          <dd>{init}</dd>
        </div>
      </dl>
    </article>
  );
}

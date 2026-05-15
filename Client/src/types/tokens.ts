export interface SidebarToken {
  id: string;
  name: string;
  type: string;
  hp: string;
  ac: string;
  speed: string;
  size: string;
  init: string;
  isEnemy: boolean;
  imageSource?: string;
  sourceTokenId?: string;
  baseName?: string;
}

export interface PlacedToken extends SidebarToken {
  instanceId: string;
  gridX: number;
  gridY: number;
}

export interface TokenDropRequestDetail {
  token: SidebarToken;
  clientX: number;
  clientY: number;
}

export interface TokenCloneCreatedDetail {
  token: SidebarToken;
}

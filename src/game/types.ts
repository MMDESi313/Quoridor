export type Player = "p1" | "p2";

export interface Position {
  row: number;
  col: number;
}

export type WallOrientation = "horizontal" | "vertical";

export interface Wall {
  orientation: WallOrientation;
  row: number;
  col: number;
  owner: Player;
}

export interface PlayerState {
  wallsLeft: number;
  position: Position;
  goalRow: number;
}

export interface GameState {
  players: Record<Player, PlayerState>;
  walls: Wall[];
  currentTurn: Player;
  winner: null | Player;
  moveHistory: GameMove[];
}

export type GameMove =
  | { type: "move"; player: Player; from: Position; to: Position }
  | { type: "wall"; player: Player; wall: Wall };

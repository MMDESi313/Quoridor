import { getLegalMoves } from "./moves";
import { hasPathToGoal } from "./pathFinding";
import type { GameMove, GameState, Player, Position, Wall } from "./types";
import { isValidWallPlacement } from "./walls";

export function createInitialState(): GameState {
  return {
    currentTurn: "p1",
    moveHistory: [],
    players: {
      p1: { goalRow: 8, position: { row: 0, col: 4 }, wallsLeft: 10 },
      p2: { goalRow: 0, position: { row: 8, col: 4 }, wallsLeft: 10 },
    },
    walls: [
      { col: 5, orientation: "horizontal", owner: "p1", row: 5 },
      { col: 1, orientation: "vertical", owner: "p2", row: 3 },
    ],
    winner: null,
  };
}

export function tryMovePiece(
  state: GameState,
  player: Player,
  to: Position,
): GameState | null {
  if (state.currentTurn !== player) return null;
  if (state.winner !== null) return null;

  const newState = structuredClone(state);
  const playerPosition = state.players[player].position;

  const legalMoves = getLegalMoves(state, player);

  for (const move of legalMoves) {
    if (move.col === to.col && move.row === to.row) {
      const gameMove: GameMove = {
        type: "move",
        player: player,
        from: playerPosition,
        to: to,
      };
      newState.players[player].position = move;
      newState.moveHistory.push(gameMove);

      if (move.row === newState.players[player].goalRow) {
        newState.winner = player;
      } else {
        newState.currentTurn = player === "p1" ? "p2" : "p1";
      }

      return newState;
    }
  }
  return null;
}

export function tryPlaceWall(state: GameState, player: Player, wall: Wall) {
  if (state.currentTurn !== player) return null;
  if (state.winner !== null) return null;
  if (state.players[player].wallsLeft <= 0) return null;

  if (isValidWallPlacement(state.walls, wall)) {
    const newState = structuredClone(state);

    newState.walls.push(wall);
    if (!hasPathToGoal(newState, "p1") || !hasPathToGoal(newState, "p2")) {
      return null;
    } else {
      const gameMove: GameMove = {
        type: "wall",
        player: player,
        wall: wall,
      };

      newState.players[player].wallsLeft -= 1;
      newState.currentTurn = player === "p1" ? "p2" : "p1";
      newState.moveHistory.push(gameMove);

      return newState;
    }
  } else return null;
}

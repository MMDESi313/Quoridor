import { create } from "zustand";
import {
  createInitialState,
  tryMovePiece,
  tryPlaceWall,
} from "../game/gameEngine";
import type { GameState, Position, Wall } from "../game/types";
import { getLegalMoves } from "../game/moves";

interface GameStore {
  gameState: GameState;
  legalMoves: Position[];
  movePiece: (to: Position) => void;
  placeWall: (wall: Wall) => void;
  reset: () => void;
}

const initialState = createInitialState();

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialState,
  legalMoves: getLegalMoves(initialState, "p1"),

  movePiece: (to) => {
    const { gameState } = get();
    const newState = tryMovePiece(gameState, gameState.currentTurn, to);

    if (newState === null) return;

    set({
      gameState: newState,
      legalMoves:
        newState.winner !== null
          ? []
          : getLegalMoves(newState, newState.currentTurn),
    });
  },

  placeWall: (wall) => {
    const { gameState } = get();
    const newState = tryPlaceWall(gameState, gameState.currentTurn, wall);

    if (newState === null) return;

    set({
      gameState: newState,
      legalMoves:
        newState.winner !== null
          ? []
          : getLegalMoves(newState, newState.currentTurn),
    });
  },

  reset: () => {
    const fresh = createInitialState();
    set({
      gameState: fresh,
      legalMoves: getLegalMoves(fresh, "p1"),
    });
  },
}));

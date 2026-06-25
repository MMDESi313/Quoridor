import { describe, it, expect } from "vitest";
import { getLegalMoves } from "./moves";
import type { GameState, Wall, Position } from "./types";

function makeState(p1: Position, p2: Position, walls: Wall[] = []): GameState {
  return {
    players: {
      p1: { position: p1, goalRow: 8, wallsLeft: 10 },
      p2: { position: p2, goalRow: 0, wallsLeft: 10 },
    },
    walls,
    currentTurn: "p1",
    winner: null,
    moveHistory: [],
  };
}

describe("getLegalMoves", () => {
  describe("Simple moves - no opponent nearby.", () => {
    it("A player in the middle of the board should have 4 possible moves.", () => {
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 0, col: 0 }),
        "p1",
      );
      expect(moves).toHaveLength(4);
      expect(moves).toContainEqual({ row: 4, col: 5 });
      expect(moves).toContainEqual({ row: 4, col: 3 });
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 4 });
    });

    it("A player in the top-left corner should have only 2 possible moves.", () => {
      const moves = getLegalMoves(
        makeState({ row: 0, col: 0 }, { row: 8, col: 8 }),
        "p1",
      );
      expect(moves).toHaveLength(2);
      expect(moves).toContainEqual({ row: 0, col: 1 });
      expect(moves).toContainEqual({ row: 1, col: 0 });
    });

    it("A player on the top edge of the board should have only 3 possible moves.", () => {
      const moves = getLegalMoves(
        makeState({ row: 0, col: 4 }, { row: 8, col: 4 }),
        "p1",
      );
      expect(moves).toHaveLength(3);
      expect(moves).toContainEqual({ row: 0, col: 3 });
      expect(moves).toContainEqual({ row: 0, col: 5 });
      expect(moves).toContainEqual({ row: 1, col: 4 });
    });

    it("A horizontal wall should block the move in that direction.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 4, owner: "p2" },
      ];
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 0, col: 0 }, walls),
        "p1",
      );
      expect(moves).not.toContainEqual({ row: 3, col: 4 });
    });

    it("A wall should not block moves in other directions.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 4, owner: "p2" },
      ];
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 0, col: 0 }, walls),
        "p1",
      );
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 3 });
      expect(moves).toContainEqual({ row: 4, col: 5 });
    });
  });

  describe("Jump over opponent - direct jump.", () => {
    it("Should jump directly over opponent when the path is clear (opponent to the right).", () => {
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 4, col: 5 }),
        "p1",
      );
      expect(moves).toContainEqual({ row: 4, col: 6 });
      expect(moves).not.toContainEqual({ row: 4, col: 5 });
    });

    it("Should jump directly over opponent when the path is clear (opponent below).", () => {
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 5, col: 4 }),
        "p1",
      );
      expect(moves).toContainEqual({ row: 6, col: 4 });
      expect(moves).not.toContainEqual({ row: 5, col: 4 });
    });

    it("Direct jump should not be possible if a wall blocks it behind the opponent.", () => {
      const walls: Wall[] = [
        { orientation: "vertical", row: 3, col: 6, owner: "p2" },
        { orientation: "vertical", row: 4, col: 6, owner: "p2" },
      ];
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 4, col: 5 }, walls),
        "p1",
      );
      expect(moves).not.toContainEqual({ row: 4, col: 6 });
    });

    it("Direct jump should not be possible if the opponent is at the edge of the board.", () => {
      const moves = getLegalMoves(
        makeState({ row: 4, col: 7 }, { row: 4, col: 8 }),
        "p1",
      );
      expect(moves).not.toContainEqual({ row: 4, col: 9 });
    });
  });

  describe("Jump over opponent - diagonal jump.", () => {
    it("Should offer diagonal jumps when direct jump is blocked by a wall.", () => {
      const walls: Wall[] = [
        { orientation: "vertical", row: 3, col: 6, owner: "p2" },
        { orientation: "vertical", row: 4, col: 6, owner: "p2" },
      ];
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 4, col: 5 }, walls),
        "p1",
      );
      expect(moves).toContainEqual({ row: 3, col: 5 });
      expect(moves).toContainEqual({ row: 5, col: 5 });
    });

    it("Should offer diagonal jumps when direct jump is blocked by the board edge.", () => {
      const moves = getLegalMoves(
        makeState({ row: 4, col: 7 }, { row: 4, col: 8 }),
        "p1",
      );
      expect(moves).toContainEqual({ row: 3, col: 8 });
      expect(moves).toContainEqual({ row: 5, col: 8 });
    });

    it("Should NOT offer a diagonal jump if a wall blocks that specific diagonal.", () => {
      const walls: Wall[] = [
        { orientation: "vertical", row: 3, col: 6, owner: "p2" },
        { orientation: "vertical", row: 4, col: 6, owner: "p2" },
        { orientation: "horizontal", row: 4, col: 4, owner: "p2" },
        { orientation: "horizontal", row: 4, col: 5, owner: "p2" },
      ];
      const moves = getLegalMoves(
        makeState({ row: 4, col: 4 }, { row: 4, col: 5 }, walls),
        "p1",
      );
      expect(moves).not.toContainEqual({ row: 3, col: 5 });
      expect(moves).toContainEqual({ row: 5, col: 5 });
    });
  });
});

import { describe, it, expect } from "vitest";
import { hasPathToGoal } from "./pathFinding";
import type { GameState, Wall } from "./types";

function makeState(p1row: number, p2row: number, walls: Wall[]): GameState {
  return {
    players: {
      p1: { position: { row: p1row, col: 4 }, goalRow: 8, wallsLeft: 10 },
      p2: { position: { row: p2row, col: 4 }, goalRow: 0, wallsLeft: 10 },
    },
    walls,
    currentTurn: "p1",
    winner: null,
    moveHistory: [],
  };
}

describe("hasPathToGoal", () => {
  describe("Open board - no walls.", () => {
    it("p1 should have a path to goalRow 8 with no walls.", () => {
      expect(hasPathToGoal(makeState(0, 8, []), "p1")).toBe(true);
    });

    it("p2 should have a path to goalRow 0 with no walls.", () => {
      expect(hasPathToGoal(makeState(0, 8, []), "p2")).toBe(true);
    });

    it("p1 already at goalRow should return true immediately.", () => {
      expect(hasPathToGoal(makeState(8, 0, []), "p1")).toBe(true);
    });

    it("p2 already at goalRow should return true immediately.", () => {
      expect(hasPathToGoal(makeState(8, 0, []), "p2")).toBe(true);
    });
  });

  describe("Partial walls - path still open.", () => {
    it("A wall covering only half the board should still leave a path.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 6, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(0, 8, walls), "p1")).toBe(true);
    });

    it("A wall on a different row should not affect the path.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 2, col: 0, owner: "p1" },
        { orientation: "horizontal", row: 2, col: 2, owner: "p1" },
        { orientation: "horizontal", row: 2, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 2, col: 5, owner: "p1" },
        { orientation: "horizontal", row: 2, col: 7, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(0, 8, walls), "p1")).toBe(false);
    });

    it("Vertical walls should not block vertical movement.", () => {
      const walls: Wall[] = [
        { orientation: "vertical", row: 0, col: 1, owner: "p1" },
        { orientation: "vertical", row: 2, col: 3, owner: "p1" },
        { orientation: "vertical", row: 4, col: 5, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(0, 8, walls), "p1")).toBe(true);
    });
  });

  describe("Fully blocked path.", () => {
    it("A complete horizontal wall across all 9 columns should block p1.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 0, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 2, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 5, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 7, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(0, 8, walls), "p1")).toBe(false);
    });

    it("A complete horizontal wall should also block p2 if they are on the other side.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 0, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 2, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 5, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 7, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(0, 8, walls), "p2")).toBe(false);
    });

    it("A wall that blocks p1 should not block p1 if p1 is already past it.", () => {
      const walls: Wall[] = [
        { orientation: "horizontal", row: 4, col: 0, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 2, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 5, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 7, owner: "p1" },
      ];
      expect(hasPathToGoal(makeState(6, 8, walls), "p1")).toBe(true);
    });
  });
});

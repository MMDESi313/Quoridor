import { describe, it, expect } from "vitest";
import { createInitialState, tryMovePiece, tryPlaceWall } from "./gameEngine";
import type { Wall } from "./types";

describe("createInitialState", () => {
  it("p1 should start at row 0, col 4.", () => {
    const state = createInitialState();
    expect(state.players.p1.position).toEqual({ row: 0, col: 4 });
  });

  it("p2 should start at row 8, col 4.", () => {
    const state = createInitialState();
    expect(state.players.p2.position).toEqual({ row: 8, col: 4 });
  });

  it("p1 goalRow should be 8.", () => {
    const state = createInitialState();
    expect(state.players.p1.goalRow).toBe(8);
  });

  it("p2 goalRow should be 0.", () => {
    const state = createInitialState();
    expect(state.players.p2.goalRow).toBe(0);
  });

  it("Both players should start with 10 walls.", () => {
    const state = createInitialState();
    expect(state.players.p1.wallsLeft).toBe(10);
    expect(state.players.p2.wallsLeft).toBe(10);
  });

  it("Initial turn should be p1.", () => {
    const state = createInitialState();
    expect(state.currentTurn).toBe("p1");
  });

  it("Initial winner should be null.", () => {
    const state = createInitialState();
    expect(state.winner).toBeNull();
  });

  it("Initial walls and moveHistory should be empty.", () => {
    const state = createInitialState();
    expect(state.walls).toHaveLength(0);
    expect(state.moveHistory).toHaveLength(0);
  });
});

describe("tryMovePiece", () => {
  describe("Valid moves.", () => {
    it("p1 should be able to move to an adjacent cell on their turn.", () => {
      const state = createInitialState();
      const newState = tryMovePiece(state, "p1", { row: 1, col: 4 });
      expect(newState).not.toBeNull();
      expect(newState?.players.p1.position).toEqual({ row: 1, col: 4 });
    });

    it("Turn should switch to p2 after p1 moves.", () => {
      const state = createInitialState();
      const newState = tryMovePiece(state, "p1", { row: 1, col: 4 });
      expect(newState?.currentTurn).toBe("p2");
    });

    it("Move should be added to moveHistory.", () => {
      const state = createInitialState();
      const newState = tryMovePiece(state, "p1", { row: 1, col: 4 });
      expect(newState?.moveHistory).toHaveLength(1);
      expect(newState?.moveHistory[0]).toEqual({
        type: "move",
        player: "p1",
        from: { row: 0, col: 4 },
        to: { row: 1, col: 4 },
      });
    });

    it("p1 should win when reaching goalRow 8.", () => {
      const state = createInitialState();
      const nearGoal = structuredClone(state);
      nearGoal.players.p1.position = { row: 7, col: 4 };
      nearGoal.players.p2.position = { row: 0, col: 0 };
      const newState = tryMovePiece(nearGoal, "p1", { row: 8, col: 4 });
      expect(newState?.winner).toBe("p1");
    });

    it("Original state should not be mutated after a move.", () => {
      const state = createInitialState();
      tryMovePiece(state, "p1", { row: 1, col: 4 });
      expect(state.players.p1.position).toEqual({ row: 0, col: 4 });
      expect(state.currentTurn).toBe("p1");
    });
  });

  describe("Invalid moves.", () => {
    it("Should return null if it is not the player's turn.", () => {
      const state = createInitialState();
      expect(tryMovePiece(state, "p2", { row: 7, col: 4 })).toBeNull();
    });

    it("Should return null if the game is already won.", () => {
      const state = { ...createInitialState(), winner: "p1" as const };
      expect(tryMovePiece(state, "p1", { row: 1, col: 4 })).toBeNull();
    });

    it("Should return null for an illegal destination (not in legalMoves).", () => {
      const state = createInitialState();
      expect(tryMovePiece(state, "p1", { row: 3, col: 4 })).toBeNull();
    });

    it("Should return null if a wall blocks the move.", () => {
      const state = createInitialState();
      const walls: Wall[] = [
        { orientation: "horizontal", row: 1, col: 3, owner: "p2" },
        { orientation: "horizontal", row: 1, col: 4, owner: "p2" },
      ];
      const blocked = { ...state, walls };
      expect(tryMovePiece(blocked, "p1", { row: 1, col: 4 })).toBeNull();
    });
  });
});

describe("tryPlaceWall", () => {
  describe("Valid wall placement.", () => {
    it("p1 should be able to place a valid wall on their turn.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      const newState = tryPlaceWall(state, "p1", wall);
      expect(newState).not.toBeNull();
      expect(newState?.walls).toHaveLength(1);
    });

    it("wallsLeft should decrement after placing a wall.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      const newState = tryPlaceWall(state, "p1", wall);
      expect(newState?.players.p1.wallsLeft).toBe(9);
    });

    it("Turn should switch after placing a wall.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      const newState = tryPlaceWall(state, "p1", wall);
      expect(newState?.currentTurn).toBe("p2");
    });

    it("Wall placement should be added to moveHistory.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      const newState = tryPlaceWall(state, "p1", wall);
      expect(newState?.moveHistory).toHaveLength(1);
      expect(newState?.moveHistory[0]).toEqual({
        type: "wall",
        player: "p1",
        wall,
      });
    });

    it("Original state should not be mutated after placing a wall.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      tryPlaceWall(state, "p1", wall);
      expect(state.walls).toHaveLength(0);
      expect(state.players.p1.wallsLeft).toBe(10);
    });
  });

  describe("Invalid wall placement.", () => {
    it("Should return null if it is not the player's turn.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p2",
      };
      expect(tryPlaceWall(state, "p2", wall)).toBeNull();
    });

    it("Should return null if the game is already won.", () => {
      const state = { ...createInitialState(), winner: "p1" as const };
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      expect(tryPlaceWall(state, "p1", wall)).toBeNull();
    });

    it("Should return null if the player has no walls left.", () => {
      const state = createInitialState();
      const noWalls = structuredClone(state);
      noWalls.players.p1.wallsLeft = 0;
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      expect(tryPlaceWall(noWalls, "p1", wall)).toBeNull();
    });

    it("Should return null if the wall overlaps an existing wall.", () => {
      const state = createInitialState();
      const wall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 4,
        owner: "p1",
      };
      const withWall = structuredClone(state);
      withWall.walls = [wall];
      expect(tryPlaceWall(withWall, "p1", wall)).toBeNull();
    });

    it("Should return null if the wall fully blocks a player's path.", () => {
      const state = createInitialState();
      const almostBlocked = structuredClone(state);
      almostBlocked.players.p1.wallsLeft = 5;
      almostBlocked.walls = [
        { orientation: "horizontal", row: 4, col: 0, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 2, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 4, owner: "p1" },
        { orientation: "horizontal", row: 4, col: 5, owner: "p1" },
      ];
      const blockingWall: Wall = {
        orientation: "horizontal",
        row: 4,
        col: 7,
        owner: "p1",
      };
      expect(tryPlaceWall(almostBlocked, "p1", blockingWall)).toBeNull();
    });
  });
});

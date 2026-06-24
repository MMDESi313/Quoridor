import { describe, it, expect } from "vitest";
import { isWallBetween, wallOverlap, isValidWallPlacement } from "./walls";
import type { Wall } from "./types";

describe("isWallBetween", () => {
  it("A horizontal wall (row:3) should block vertical movement between row 2 and row 3 on the same column.", () => {
    const walls: Wall[] = [
      { orientation: "horizontal", col: 4, row: 3, owner: "p1" },
    ];
    expect(isWallBetween(walls, { row: 2, col: 4 }, { row: 3, col: 4 })).toBe(
      true,
    );
  });
  it("A horizontal wall (row:3) should NOT block movement between row 3 and row 4 (that belongs to a row:4 wall).", () => {
    const walls: Wall[] = [
      { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
    ];
    expect(isWallBetween(walls, { row: 3, col: 4 }, { row: 4, col: 4 })).toBe(
      false,
    );
  });
  it("A horizontal wall should also block the adjacent column (col+1).", () => {
    const walls: Wall[] = [
      { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
    ];
    expect(isWallBetween(walls, { row: 2, col: 5 }, { row: 3, col: 5 })).toBe(
      true,
    );
  });
  it("A horizontal wall should NOT block an unrelated, far-away column.", () => {
    const walls: Wall[] = [
      { orientation: "horizontal", row: 3, col: 0 },
    ] as Wall[];
    expect(isWallBetween(walls, { row: 2, col: 7 }, { row: 3, col: 7 })).toBe(
      false,
    );
  });
  it("A vertical wall (col:1) should block horizontal movement between col 0 and col 1 on the same row.", () => {
    const walls: Wall[] = [
      { orientation: "vertical", row: 4, col: 1, owner: "p2" },
    ];
    expect(isWallBetween(walls, { row: 4, col: 0 }, { row: 4, col: 1 })).toBe(
      true,
    );
  });
  it("A vertical wall (col:1) should NOT block movement between col 1 and col 2 (that belongs to a col:2 wall).", () => {
    const walls: Wall[] = [
      { orientation: "vertical", row: 4, col: 1, owner: "p2" },
    ];
    expect(isWallBetween(walls, { row: 4, col: 1 }, { row: 4, col: 2 })).toBe(
      false,
    );
  });
  it("A vertical wall should also block the adjacent row (row+1).", () => {
    const walls: Wall[] = [
      { orientation: "vertical", row: 4, col: 1, owner: "p2" },
    ];
    expect(isWallBetween(walls, { row: 5, col: 0 }, { row: 5, col: 1 })).toBe(
      true,
    );
  });
  it("A vertical wall should NOT block an unrelated, far-away row.", () => {
    const walls: Wall[] = [
      { orientation: "vertical", row: 5, col: 2, owner: "p2" },
    ];
    expect(isWallBetween(walls, { row: 1, col: 1 }, { row: 1, col: 2 })).toBe(
      false,
    );
  });
  it("Movement should not be blocked when there are no walls.", () => {
    expect(isWallBetween([], { row: 0, col: 0 }, { row: 1, col: 0 })).toBe(
      false,
    );
  });
  it("Should return false for diagonal (non-adjacent) positions.", () => {
    expect(isWallBetween([], { row: 3, col: 4 }, { row: 2, col: 3 })).toBe(
      false,
    );
  });
});

describe("wallOverlap", () => {
  it("Two horizontal walls with the same row and column should overlap.", () => {
    const a: Wall = { orientation: "horizontal", row: 3, col: 4, owner: "p1" };
    const b: Wall = { orientation: "horizontal", row: 3, col: 4, owner: "p2" };
    expect(wallOverlap(a, b)).toBe(true);
  });
  it("Two horizontal walls one column apart should overlap (partial overlap).", () => {
    const a: Wall = { orientation: "horizontal", row: 3, col: 4, owner: "p1" };
    const b: Wall = { orientation: "horizontal", row: 3, col: 3, owner: "p2" };
    expect(wallOverlap(a, b)).toBe(true);
  });
  it("Two horizontal walls two columns apart should NOT overlap.", () => {
    const a: Wall = { orientation: "horizontal", row: 3, col: 4, owner: "p1" };
    const b: Wall = { orientation: "horizontal", row: 3, col: 6, owner: "p2" };
    expect(wallOverlap(a, b)).toBe(false);
  });
  it("A horizontal and a vertical wall crossing through the same midpoint should overlap.", () => {
    const h: Wall = { orientation: "horizontal", row: 3, col: 4, owner: "p1" };
    const v: Wall = { orientation: "vertical", row: 2, col: 5, owner: "p2" };
    expect(wallOverlap(h, v)).toBe(true);
    // symmetry: argument order should not change the result
    expect(wallOverlap(v, h)).toBe(true);
  });
  it("Two walls far apart should NOT overlap", () => {
    const a: Wall = { orientation: "horizontal", row: 0, col: 0, owner: "p1" };
    const b: Wall = { orientation: "vertical", row: 6, col: 6, owner: "p2" };
    expect(wallOverlap(a, b)).toBe(false);
  });
});

describe("isValidWallPlacement", () => {
  describe("Horizontal wall - valid range.", () => {
    it("A normal wall in the middle of the board should be valid", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("row=1 (highest valid boundary) should be valid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 1,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("row=8 (lowest valid boundary) should be valid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 8,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("row=0 (top edge of the board) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 0,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("row=9 (out of bounds, since max valid boundary is 8) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 9,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("col=0 should be valid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 0,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("col=7 (wall length reaches exactly the edge of the board) should be valid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 7,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("col=8 (wall length goes outside the board) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 8,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("Negative col should be invalid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: -1,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
  });

  describe("Vertical wall - valid range.", () => {
    it("A normal wall in the middle of the board should be valid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 3,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("col=1 should be valid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 4,
        col: 1,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("col=8 should be valid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 4,
        col: 8,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("col=0 (left edge of the board) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 4,
        col: 0,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("col=9 (out of bounds, since max valid boundary is 8) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 4,
        col: 9,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("row=0 should be valid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 0,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("row=7 (wall length reaches exactly the edge of the board) should be valid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 7,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(true);
    });
    it("row=8 (wall length goes outside the board) should be invalid.", () => {
      const candidate: Wall = {
        orientation: "vertical",
        row: 8,
        col: 4,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
    it("Negative row should be invalid.", () => {
      const candidate: Wall = {
        orientation: "horizontal",
        row: -1,
        col: 1,
        owner: "p1",
      };
      expect(isValidWallPlacement([], candidate)).toBe(false);
    });
  });

  describe("Overlap with existing walls.", () => {
    it("A wall placed exactly on top of an existing wall should be rejected.", () => {
      const existing: Wall[] = [
        { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
      ];
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 4,
        owner: "p2",
      };
      expect(isValidWallPlacement(existing, candidate)).toBe(false);
    });
    it("A wall with partial overlap with an existing wall should be rejected.", () => {
      const existing: Wall[] = [
        { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
      ];
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 5,
        owner: "p2",
      };
      expect(isValidWallPlacement(existing, candidate)).toBe(false);
    });
    it("A wall placed far enough from an existing wall should be accepted.", () => {
      const existing: Wall[] = [
        { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
      ];
      const candidate: Wall = {
        orientation: "horizontal",
        row: 3,
        col: 6,
        owner: "p2",
      };
      expect(isValidWallPlacement(existing, candidate)).toBe(true);
    });
    it("A vertical wall crossing through the midpoint of an existing horizontal wall should be rejected.", () => {
      const existing: Wall[] = [
        { orientation: "horizontal", row: 3, col: 4, owner: "p1" },
      ];
      const candidate: Wall = {
        orientation: "vertical",
        row: 2,
        col: 5,
        owner: "p2",
      };
      expect(isValidWallPlacement(existing, candidate)).toBe(false);
    });
  });
});

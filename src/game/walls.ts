import { type Position, type Wall } from "./types";

export function isWallBetween(
  walls: Wall[],
  from: Position,
  to: Position,
): boolean {
  if (from.col === to.col) {
    const row = Math.min(from.row, to.row);
    const horizontalWalls = walls.filter(
      (wall) => wall.orientation === "horizontal",
    );
    return horizontalWalls.some(
      (wall) =>
        (wall.col === from.col || wall.col === from.col - 1) &&
        wall.row === row,
    );
  } else if (from.row === to.row) {
    const col = Math.min(from.col, to.col);
    const verticalWalls = walls.filter(
      (wall) => wall.orientation === "vertical",
    );
    return verticalWalls.some(
      (wall) =>
        (wall.row === from.row || wall.row === from.row - 1) &&
        wall.col === col,
    );
  } else {
    return false;
  }
}

export function wallOverlap(a: Wall, b: Wall): boolean {
  if (a.orientation === b.orientation) {
    if (a.orientation === "horizontal") {
      if (a.row !== b.row) return false;
      if (a.col === b.col) {
        return true;
      } else {
        return Math.abs(a.col - b.col) === 1;
      }
    } else {
      if (a.col !== b.col) return false;
      if (a.row === b.row) {
        return true;
      } else {
        return Math.abs(a.row - b.row) === 1;
      }
    }
  } else {
    if (a.orientation === "horizontal") {
      return a.col === b.col - 1 && a.row === b.row + 1;
    } else {
      return b.col === a.col - 1 && b.row === a.row + 1;
    }
  }
}

export function isWalidWallPlacement(
  existingWalls: Wall[],
  candidate: Wall,
): boolean {
  if (candidate.orientation === "horizontal") {
    const valid =
      candidate.col >= 0 &&
      candidate.col <= 7 &&
      candidate.row >= 1 &&
      candidate.row <= 8;

    if (!valid) return false;
  } else {
    const valid =
      candidate.col >= 1 &&
      candidate.col <= 8 &&
      candidate.row >= 0 &&
      candidate.row <= 7;

    if (!valid) return false;
  }

  for (const wall of existingWalls) {
    const overlap = wallOverlap(wall, candidate);
    if (overlap) return false;
  }

  return true;
}

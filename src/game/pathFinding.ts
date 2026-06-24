import type { GameState, Player, Position } from "./types";
import { isWallBetween } from "./walls";

export function hasPathToGoal(state: GameState, player: Player): boolean {
  const queue: Position[] = [state.players[player].position];
  const visited = new Set<string>();
  visited.add(`${queue[0].row},${queue[0].col}`);

  while (queue.length > 0) {
    const currentCol = queue[0].col;
    const currentRow = queue[0].row;

    if (queue[0].row === state.players[player].goalRow) {
      return true;
    }

    const adjacents: Position[] = [
      { col: currentCol, row: currentRow + 1 },
      { col: currentCol, row: currentRow - 1 },
      { col: currentCol + 1, row: currentRow },
      { col: currentCol - 1, row: currentRow },
    ];

    for (const adjacent of adjacents) {
      const key = `${adjacent.row},${adjacent.col}`;
      if (
        adjacent.col > 8 ||
        adjacent.col < 0 ||
        adjacent.row > 8 ||
        adjacent.row < 0 ||
        visited.has(key)
      ) {
        continue;
      }

      const isWallBetweenState = isWallBetween(state.walls, queue[0], adjacent);

      if (isWallBetweenState) {
        continue;
      } else {
        if (adjacent.row === state.players[player].goalRow) {
          return true;
        }
        visited.add(key);
        queue.push(adjacent);
      }
    }

    queue.shift();
  }

  return false;
}

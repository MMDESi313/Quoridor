import type { GameState, Player, Position } from "./types";
import { isWallBetween } from "./walls";

function isValidPosition(position: Position): boolean {
  if (
    position.col > 8 ||
    position.col < 0 ||
    position.row > 8 ||
    position.row < 0
  ) {
    return false;
  } else {
    return true;
  }
}

export function getLegalMoves(state: GameState, player: Player): Position[] {
  const moves: Position[] = [];
  const playerPosition = state.players[player].position;
  const opponent = state.players[player === "p1" ? "p2" : "p1"];

  const adjacents: Position[] = [
    { row: playerPosition.row, col: playerPosition.col + 1 },
    { row: playerPosition.row, col: playerPosition.col - 1 },
    { row: playerPosition.row + 1, col: playerPosition.col },
    { row: playerPosition.row - 1, col: playerPosition.col },
  ];

  for (const adjacent of adjacents) {
    if (!isValidPosition(adjacent)) {
      continue;
    } else if (
      adjacent.col === opponent.position.col &&
      adjacent.row === opponent.position.row
    ) {
      const opponentAdjacents: Position[] = [
        { row: opponent.position.row, col: opponent.position.col + 1 },
        { row: opponent.position.row, col: opponent.position.col - 1 },
        { row: opponent.position.row + 1, col: opponent.position.col },
        { row: opponent.position.row - 1, col: opponent.position.col },
      ];

      const directOption = opponentAdjacents.filter((opponentAdjacent) => {
        const sameRow = opponentAdjacent.row === playerPosition.row;
        const sameCol = opponentAdjacent.col === playerPosition.col;
        return (sameRow || sameCol) && !(sameRow && sameCol);
      });
      const diagonalOptions = opponentAdjacents.filter(
        (opponentAdjacent) =>
          opponentAdjacent.col !== playerPosition.col &&
          opponentAdjacent.row !== playerPosition.row,
      );

      const isDirectOptionValid = isValidPosition(directOption[0]) && !isWallBetween(state.walls, opponent.position, directOption[0])

      if (isDirectOptionValid) {
        moves.push(directOption[0])
      } else {
        diagonalOptions.forEach((diagonalOption) => {
          const isDiagonalOptionPositionValid = isValidPosition(diagonalOption)
          const isWallBetweenState = isWallBetween(state.walls, opponent.position, diagonalOption)
          if (isDiagonalOptionPositionValid && !isWallBetweenState) {moves.push(diagonalOption)}
        })
      }
    } else {
      const isWallBetweenState = isWallBetween(
        state.walls,
        playerPosition,
        adjacent,
      );
      if (isWallBetweenState) {
        continue;
      } else {
        moves.push(adjacent);
      }
    }
  }

  return moves;
}

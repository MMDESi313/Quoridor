import { useMemo } from "react";
import { useGameStore } from "../../stores/gameStore";
import WallSlot from "./WallSlot";
import Cell from "./Cell";
import { getLegalMoves } from "../../game/moves";

const COLS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");
const ROWS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");

function Board() {
  const { gameState } = useGameStore();

  const legalMoves = useMemo(() => {
    return getLegalMoves(gameState, gameState.currentTurn);
  }, [gameState]);

  return (
    <section
      dir="ltr"
      className="grid p-2"
      style={{
        gridTemplateColumns: COLS,
        gridTemplateRows: ROWS,
      }}
    >
      {Array.from({ length: 17 * 17 }).map((_, i) => {
        const rowIndex = Math.floor(i / 17);
        const colIndex = i % 17;
        const isCell = rowIndex % 2 === 0 && colIndex % 2 === 0;
        const isHWall = rowIndex % 2 === 1 && colIndex % 2 === 0;
        const isVWall = rowIndex % 2 === 0 && colIndex % 2 === 1;
        const isIntersection = rowIndex % 2 === 1 && colIndex % 2 === 1;

        const cellPosition = { row: rowIndex / 2, col: colIndex / 2 };
        const cellHasPlayer =
          gameState.players.p1.position.col === cellPosition.col &&
          gameState.players.p1.position.row === cellPosition.row
            ? "p1"
            : gameState.players.p2.position.col === cellPosition.col &&
                gameState.players.p2.position.row === cellPosition.row
              ? "p2"
              : null;
        const isCurrentMoveLegal = legalMoves.find(
          (position) =>
            position.row === cellPosition.row &&
            position.col === cellPosition.col,
        );
        const cellHighlighted = isCurrentMoveLegal
          ? gameState.currentTurn === "p1"
            ? { player: "p1", position: isCurrentMoveLegal }
            : { player: "p2", position: isCurrentMoveLegal }
          : null;

        return (
          <div key={i} className={`flex items-center justify-center`}>
            {isHWall || isVWall ? (
              <WallSlot />
            ) : isIntersection ? (
              <div></div>
            ) : isCell ? (
              <Cell
                hasPlayer={cellHasPlayer}
                highlighted={cellHighlighted}
                position={cellPosition}
              />
            ) : (
              ""
            )}
          </div>
        );
      })}
    </section>
  );
}

export default Board;

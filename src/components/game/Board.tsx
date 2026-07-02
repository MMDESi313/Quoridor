import { useMemo, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import WallSlot from "./WallSlot";
import Cell from "./Cell";
import { getLegalMoves } from "../../game/moves";
import type { Wall } from "../../game/types";
import { isValidWallPlacement } from "../../game/walls";

const COLS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");
const ROWS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");

function Board() {
  const { gameState } = useGameStore();

  const [isHovered, setIsHovered] = useState<Wall | null>(null);
  const legalMoves = useMemo(
    () => getLegalMoves(gameState, gameState.currentTurn),
    [gameState],
  );

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

        const wall: Wall = {
          row: Math.ceil(rowIndex / 2),
          col: Math.ceil(colIndex / 2),
          orientation: isHWall ? "horizontal" : "vertical",
          owner: gameState.currentTurn,
        };

        let wallPreviewClass = "";
        if (isVWall || isHWall) {
          if (isHovered) {
            if (wall.orientation === isHovered.orientation) {
              if (isHovered.orientation === "horizontal") {
                wallPreviewClass =
                  isHovered.col === 8
                    ? ""
                    : isHovered.col === wall.col && isHovered.row === wall.row
                      ? `rounded-l-full ${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"}`
                      : isHovered.col + 1 === wall.col &&
                          isHovered.row === wall.row
                        ? `rounded-r-full ${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"}`
                        : "";
              } else if (isHovered.orientation === "vertical") {
                wallPreviewClass =
                  isHovered.row === 8
                    ? ""
                    : isHovered.col === wall.col && isHovered.row === wall.row
                      ? `rounded-t-full ${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"}`
                      : isHovered.col === wall.col &&
                          isHovered.row + 1 === wall.row
                        ? `rounded-b-full ${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"}`
                        : "";
              }
            }
          }
        }

        let hasWallClass = "";
        if (isHWall || isVWall) {
          const matchingWall = gameState.walls.find((existedWall) => {
            if (existedWall.orientation === wall.orientation) {
              if (existedWall.orientation === "horizontal") {
                return (
                  existedWall.row === wall.row &&
                  (existedWall.col === wall.col ||
                    existedWall.col + 1 === wall.col)
                );
              } else {
                return (
                  existedWall.col === wall.col &&
                  (existedWall.row === wall.row ||
                    existedWall.row + 1 === wall.row)
                );
              }
            }
          });
          if (matchingWall) {
            if (matchingWall.orientation === "horizontal") {
              hasWallClass =
                matchingWall.col === wall.col
                  ? `rounded-l-full ${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"}`
                  : matchingWall.col + 1 === wall.col
                    ? `rounded-r-full ${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"}`
                    : "";
            } else {
              hasWallClass =
                matchingWall.row === wall.row
                  ? `rounded-t-full ${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"}`
                  : matchingWall.row + 1 === wall.row
                    ? `rounded-b-full ${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"}`
                    : "";
            }
          }
        }

        let intersectionPreviewClass = "";
        if (isIntersection) {
          if (isHovered)
            if (isHovered.orientation === "horizontal") {
              intersectionPreviewClass =
                isHovered.col * 2 + 1 === colIndex &&
                isHovered.row * 2 - 1 === rowIndex
                  ? `${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"} w-full h-1/2`
                  : "";
            } else if (isHovered.orientation === "vertical") {
              intersectionPreviewClass =
                isHovered.col * 2 - 1 === colIndex &&
                isHovered.row * 2 + 1 === rowIndex
                  ? `${gameState.currentTurn === "p1" ? "bg-[#0000DC40]" : "bg-[#DC000040]"} h-full w-1/2`
                  : "";
            }
        }

        let intersectionHasWallClass = "";
        if (isIntersection) {
          const matchingWall = gameState.walls.find((existedWall) => {
            if (existedWall.orientation === "horizontal") {
              return (
                existedWall.col * 2 + 1 === colIndex &&
                existedWall.row * 2 - 1 === rowIndex
              );
            } else {
              return (
                existedWall.col * 2 - 1 === colIndex &&
                existedWall.row * 2 + 1 === rowIndex
              );
            }
          });
          if (matchingWall) {
            if (matchingWall.orientation === "horizontal") {
              intersectionHasWallClass = `${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"} w-full h-1/2`;
            } else {
              intersectionHasWallClass = `${matchingWall.owner === "p1" ? "bg-[#0000DC]" : "bg-[#DC0000]"} h-full w-1/2`;
            }
          }
        }

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
          <div
            key={i}
            className="w-full h-full flex items-center justify-center"
          >
            {isHWall || isVWall ? (
              <div
                className="w-full h-full flex items-center justify-center"
                onMouseEnter={() => {
                  if (isValidWallPlacement(gameState.walls, wall)) {
                    setIsHovered(wall);
                  }
                }}
                onMouseLeave={() => {
                  setIsHovered(null);
                }}
              >
                <WallSlot
                  wall={wall}
                  wallSlotState={{
                    hasWall: false,
                    isPreview: !!wallPreviewClass,
                    wallClass: wallPreviewClass
                      ? wallPreviewClass
                      : hasWallClass
                        ? hasWallClass
                        : "",
                  }}
                />
              </div>
            ) : isIntersection ? (
              <div
                className={`${intersectionPreviewClass} ${intersectionHasWallClass}`}
              ></div>
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

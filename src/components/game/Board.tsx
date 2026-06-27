import { useMemo, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import type { Wall } from "../../game/types";
import WallSlot from "./WallSlot";
import Cell from "./Cell";

export type WallSegmentClass =
  | "rounded-l-full"
  | "rounded-r-full"
  | "rounded-t-full"
  | "rounded-b-full"
  | "h-1/2 w-full"
  | "h-full w-1/2";

const COLS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");
const ROWS = Array.from({ length: 17 }, (_, i) =>
  i % 2 === 0 ? "48px" : "16px",
).join(" ");

function Board() {
  const { gameState } = useGameStore();

  const [hoveredElement, setHoveredElement] = useState<Wall | null>(null);

  const elementsToStyle: {
    wall: Wall;
    class: WallSegmentClass;
  }[] = useMemo(() => {
    if (!hoveredElement) return [];
    if (hoveredElement.orientation === "horizontal") {
      return [
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col,
            row: hoveredElement.row,
            owner: hoveredElement.owner,
          },
          class: "rounded-l-full",
        },
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col + 1,
            row: hoveredElement.row,
            owner: hoveredElement.owner,
          },
          class: "h-1/2 w-full",
        },
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col + 2,
            row: hoveredElement.row,
            owner: hoveredElement.owner,
          },
          class: "rounded-r-full",
        },
      ];
    } else {
      return [
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col,
            row: hoveredElement.row,
            owner: hoveredElement.owner,
          },
          class: "rounded-t-full",
        },
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col,
            row: hoveredElement.row + 1,
            owner: hoveredElement.owner,
          },
          class: "h-full w-1/2",
        },
        {
          wall: {
            orientation: hoveredElement.orientation,
            col: hoveredElement.col,
            row: hoveredElement.row + 2,
            owner: hoveredElement.owner,
          },
          class: "rounded-b-full",
        },
      ];
    }
  }, [hoveredElement]);

  const handleMouseEnter = (
    rowIndex: number,
    colIndex: number,
    isHWall: boolean,
    isVWall: boolean,
  ) => {
    if (isVWall && rowIndex + 2 < 17) {
      setHoveredElement({
        row: rowIndex,
        col: colIndex,
        orientation: "vertical",
        owner: gameState.currentTurn,
      });
    } else if (isHWall && colIndex + 2 < 17) {
      setHoveredElement({
        row: rowIndex,
        col: colIndex,
        orientation: "horizontal",
        owner: gameState.currentTurn,
      });
    } else {
      setHoveredElement(null);
    }
  };

  return (
    <section
      dir="ltr"
      className="grid p-2"
      style={{
        gridTemplateColumns: COLS,
        gridTemplateRows: ROWS,
      }}
      onMouseLeave={() => setHoveredElement(null)}
    >
      {Array.from({ length: 17 * 17 }).map((_, i) => {
        const rowIndex = Math.floor(i / 17);
        const colIndex = i % 17;
        const isCell = rowIndex % 2 === 0 && colIndex % 2 === 0;
        const isHWall = rowIndex % 2 === 1 && colIndex % 2 === 0;
        const isVWall = rowIndex % 2 === 0 && colIndex % 2 === 1;
        const isIntersection = rowIndex % 2 === 1 && colIndex % 2 === 1;

        const preview = elementsToStyle.find(
          (element) =>
            element.wall.col === colIndex && element.wall.row === rowIndex,
        );

        const wallRow = Math.ceil(rowIndex / 2);
        const wallCol = Math.ceil(colIndex / 2);

        const cellRow = isCell && rowIndex / 2;
        const cellCol = isCell && colIndex / 2;

        return (
          <div
            key={i}
            className={`flex items-center justify-center`}
            onMouseEnter={() =>
              handleMouseEnter(rowIndex, colIndex, isHWall, isVWall)
            }
          >
            {isHWall || isVWall ? (
              <WallSlot
                wall={{
                  col: wallCol,
                  row: wallRow,
                  orientation: isHWall ? "horizontal" : "vertical",
                  owner: gameState.currentTurn,
                }}
                preview={preview}
              />
            ) : isIntersection ? (
              <div
                className={`${preview ? preview.class : ""} ${preview ? (gameState.currentTurn === "p1" ? "bg-[#0000dc40]" : gameState.currentTurn === "p2" ? "bg-[#dc000040]" : "") : ""}`}
              ></div>
            ) : (
              <Cell />
            )}
          </div>
        );
      })}
    </section>
  );
}

export default Board;

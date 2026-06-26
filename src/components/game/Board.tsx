import { useMemo, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import type { Wall } from "../../game/types";

type WallSegmentClass =
  | "rounded-l-full"
  | "rounded-r-full"
  | "rounded-t-full"
  | "rounded-b-full"
  | "my-1"
  | "mx-1";

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
    row: number;
    col: number;
    class: WallSegmentClass;
  }[] = useMemo(() => {
    if (!hoveredElement) return [];
    if (hoveredElement.orientation === "horizontal") {
      return [
        {
          row: hoveredElement.row,
          col: hoveredElement.col,
          class: "rounded-l-full",
        },
        {
          row: hoveredElement.row,
          col: hoveredElement.col + 1,
          class: "my-1",
        },
        {
          row: hoveredElement.row,
          col: hoveredElement.col + 2,
          class: "rounded-r-full",
        },
      ];
    } else {
      return [
        {
          row: hoveredElement.row,
          col: hoveredElement.col,
          class: "rounded-t-full",
        },
        {
          row: hoveredElement.row + 1,
          col: hoveredElement.col,
          class: "mx-1",
        },
        {
          row: hoveredElement.row + 2,
          col: hoveredElement.col,
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
          (element) => element.col === colIndex && element.row === rowIndex,
        );

        return (
          <div
            key={i}
            className={`
              ${isCell ? "bg-[#DDDDDD] cell-shadow rounded-xl" : ""}
              ${isHWall ? "my-1" : ""}  
              ${isVWall ? "mx-1" : ""}
              ${preview ? `${gameState.currentTurn === "p1" ? "bg-[#0000dc40]" : "bg-[#DC000040]"} ${preview.class}` : ""}
            `}
            onMouseEnter={() =>
              handleMouseEnter(rowIndex, colIndex, isHWall, isVWall)
            }
          >
            {isCell ? "" : isHWall ? "" : isVWall ? "" : ""}
          </div>
        );
      })}
    </section>
  );
}

export default Board;

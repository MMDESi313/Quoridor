import { tryMovePiece } from "../../game/gameEngine";
import type { Player, Position } from "../../game/types";
import { useGameStore } from "../../stores/gameStore";

interface CellProps {
  hasPlayer: Player | null;
  position: Position;
  highlighted: { player: string; position: Position } | null;
}

function Cell({ hasPlayer, highlighted, position }: CellProps) {
  const { gameState, movePiece } = useGameStore();

  const handleMove = (destinationCell: Position) => {
    const newGameState = tryMovePiece(
      gameState,
      gameState.currentTurn,
      destinationCell,
    );

    if (newGameState) {
      movePiece(destinationCell);
    } else return;
  };

  return (
    <div
      className={`w-full h-full rounded-xl flex justify-center items-center ${position.row === 0 ? "bg-[#0000ff30]" : position.row === 8 ? "bg-[#ff000030]" : "bg-[#DDDDDD]"}`}
    >
      {hasPlayer ? (
        <div
          className={`w-8/12 h-8/12 rounded-full ${hasPlayer === "p1" ? "bg-[#0000ff]" : hasPlayer === "p2" ? "bg-[#ff0000]" : ""}`}
        />
      ) : highlighted ? (
        <button
          className={`w-full h-full rounded-xl flex justify-center items-center`}
          onClick={() => handleMove(highlighted.position)}
        >
          <div
            className={`w-5/12 h-5/12 rounded-full ${gameState.winner ? "" : highlighted.player === "p1" ? "bg-[#0000ff40]" : highlighted.player === "p2" ? "bg-[#ff000040]" : ""}`}
          />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default Cell;

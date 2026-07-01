import { tryPlaceWall } from "../../game/gameEngine";
import type { Wall } from "../../game/types";
import { useGameStore } from "../../stores/gameStore";

interface WallSlotProps {
  wall: Wall;
  wallSlotState: { isPreview: boolean; hasWall: boolean; wallClass: string };
}

function WallSlot({ wall, wallSlotState }: WallSlotProps) {
  const { gameState, placeWall } = useGameStore();

  const handlePlaceWall = () => {
    const newState = tryPlaceWall(gameState, gameState.currentTurn, wall);

    console.log(newState);
    if (newState) {
      placeWall(wall);
    } else return;
  };
  return (
    <div
      className={`flex items-center justify-center ${wall.orientation === "horizontal" ? "h-1/2 w-full" : wall.orientation === "vertical" ? "w-1/2 h-full" : "w-full h-full"} ${wallSlotState.wallClass}`}
    >
      <button
        className="w-full h-full cursor-pointer"
        disabled={wallSlotState.hasWall}
        onClick={() => {
          handlePlaceWall();
        }}
      ></button>
    </div>
  );
}

export default WallSlot;

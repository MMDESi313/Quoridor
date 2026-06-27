import type { Wall } from "../../game/types";
import { useGameStore } from "../../stores/gameStore";
import type { WallSegmentClass } from "./Board";

interface WallSlotProps {
  wall: Wall;
  preview:
    | {
        wall: Wall;
        class: WallSegmentClass;
      }
    | undefined;
}

function WallSlot({ wall, preview }: WallSlotProps) {
  const { gameState } = useGameStore();

  return (
    <button
      className={`${wall.orientation === "horizontal" ? "w-full h-1/2" : "h-full w-1/2"} ${preview ? `${preview.class} ${wall.owner === "p1" ? "bg-[#0000dc40]" : "bg-[#dc000040]"}` : ""}`}
    ></button>
  );
}

export default WallSlot;

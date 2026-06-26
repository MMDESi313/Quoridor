import type { Player } from "../../game/types";
import { useGameStore } from "../../stores/gameStore";
import toPersianDigits from "../../utils/toPersianDigits";

interface PlayerPanelProps {
  player: Player;
}

function PlayerPanel({ player }: PlayerPanelProps) {
  const { gameState } = useGameStore();

  return (
    <section
      className={`w-1/5 h-1/6 flex flex-col justify-evenly bg-[#FAFAF9] ${player === "p1" ? "blue-player-panel rounded-l-4xl" : "red-player-panel rounded-r-4xl"}`}
    >
      <div className="flex items-center justify-center gap-4">
        <p className="text-2xl font-semibold text-white text-center">
          دیوارهای باقیمانده:
        </p>
        <p className="text-3xl font-bold text-white text-center">
          {toPersianDigits(gameState.players[player].wallsLeft)}
        </p>
      </div>
    </section>
  );
}

export default PlayerPanel;

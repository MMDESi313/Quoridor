import { useGameStore } from "../../stores/gameStore";
import toPersianDigits from "../../utils/toPersianDigits";

function PlayersPanel() {
  const { gameState } = useGameStore();

  return (
    <section className="w-full max-w-140 flex justify-between gap-2 px-4 py-2">
      <div className="bg-[#0000ff] py-2 px-4 text-white flex items-center gap-4 font-bold rounded-lg">
        <span dir="rtl">تعداد دیوارهای باقیمانده</span>
        <span className="text-xl">
          {toPersianDigits(gameState.players.p1.wallsLeft)}
        </span>
      </div>
      <div className="bg-[#ff0000] py-2 px-4 text-white flex items-center gap-4 font-bold rounded-lg">
        <span className="text-xl">
          {toPersianDigits(gameState.players.p2.wallsLeft)}
        </span>
        <span dir="ltr">تعداد دیوارهای باقیمانده</span>
      </div>
    </section>
  );
}

export default PlayersPanel;

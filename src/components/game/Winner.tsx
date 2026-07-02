import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../stores/gameStore";

function Winner() {
  const { gameState, reset } = useGameStore();
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-full bg-[#00000070] absolute flex justify-center items-center">
      <section className="w-10/12 sm:w-lg md:w-xl lg:w-2xl bg-white p-6 rounded-2xl">
        <div
          className={`w-full flex flex-col justify-center items-center gap-4 py-8 px-4 rounded-xl ${gameState.winner === "p1" ? "bg-[#0000FF22]" : gameState.winner === "p2" ? "bg-[#FF000022]" : ""}`}
        >
          <span className="text-2xl font-semibold">برنده بازی</span>
          {gameState.winner === "p1" ? (
            <span className="text-4xl font-extrabold text-[#0000FF]">
              بازیکن آبی
            </span>
          ) : gameState.winner === "p2" ? (
            <span className="text-4xl font-extrabold text-[#FF0000]">
              بازیکن قرمز
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="w-full flex justify-center items-center gap-4 pt-4 flex-col sm:flex-row">
          <button
            className="w-full sm:flex-1 bg-[#0000FF] text-white py-2 px-4 rounded-xl cursor-pointer"
            onClick={() => {
              reset();
            }}
          >
            بازی دوباره
          </button>
          <button
            className="w-full sm:flex-1 bg-[#FF0000] text-white text-center py-2 px-4 rounded-xl"
            onClick={() => {
              navigate("/");
              reset();
            }}
          >
            برگشت به خانه
          </button>
        </div>
      </section>
    </div>
  );
}

export default Winner;

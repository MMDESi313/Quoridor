import Board from "../components/game/Board";
import PlayersPanel from "../components/game/PlayersPanel";

function GamePage() {
  return (
    <main className="h-dvh flex flex-col justify-center items-center">
      <PlayersPanel />
      <Board />
    </main>
  );
}

export default GamePage;

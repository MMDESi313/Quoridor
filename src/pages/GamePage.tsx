import Board from "../components/game/Board";
import PlayerPanel from "../components/game/PlayerPanel";

function GamePage() {
  return (
    <main className="h-dvh flex justify-between items-center">
      <PlayerPanel player="p1" />
      <Board />
      <PlayerPanel player="p2" />
    </main>
  );
}

export default GamePage;

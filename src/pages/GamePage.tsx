import PlayerPanel from "../components/game/PlayerPanel";

function GamePage() {
  return (
    <main className="h-screen flex justify-between items-center">
      <PlayerPanel player="p1" />
      <PlayerPanel player="p2" />
    </main>
  );
}

export default GamePage;

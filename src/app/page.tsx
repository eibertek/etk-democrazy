// import GameContainer from "./src/components/gameContainer";
"use client";
import dynamic from 'next/dynamic'
 
const GameContainer = dynamic(
  () => import("../components/game-container"),
  { ssr: false }
)

export default function Home() {
  window.onresize = function(){ location.reload(); }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <GameContainer />  
      </main>
    </div>
  );
}

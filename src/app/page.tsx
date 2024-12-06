// import GameContainer from "./src/components/gameContainer";
"use client";
import dynamic from 'next/dynamic'
 
const GameContainer = dynamic(
  () => import("../components/game-container"),
  { ssr: false }
)

export default function Home() {
  if (typeof window !== "undefined") {
    // Client-side-only code
    window.onresize = function(){ location.reload(); }
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <GameContainer />  
      </main>
    </div>
  );
}

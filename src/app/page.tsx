import GameContainer from "@/components/gameContainer";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <GameContainer />  
      </main>
    </div>
  );
}

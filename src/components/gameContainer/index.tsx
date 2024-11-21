"use client";
import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/components/gameContainer/PhaserGame';

function GameContainer()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {}

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} /> 
        </div>
    )
}

export default GameContainer;

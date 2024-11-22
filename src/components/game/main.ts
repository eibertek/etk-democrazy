
import { GameOver } from '@/components/scene/game-over';
import { Game as MainGame } from '@/components/scene/first-map';
import { MainMenu } from '@/components/scene/main-menu';
import GameUI from '@/components/game/GameUI';
import { AUTO, Game } from 'phaser';
import { Preloader } from '@/components/scene/preloader';
import { Boot } from '@/components/game/Boot';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,            
        },
      },    
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver,
        GameUI,
        MainMenu,
    ],
    scale: {
//        zoom:2
    }
};

const RootMenu = (parent: string) => {

    return new Game({ ...config, parent });

}

export default RootMenu;

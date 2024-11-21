import { Boot } from './Boot';
import { GameOver } from '@/components/Scene/GameOver';
import { Game as MainGame } from '@/components/Scene/FirstMap';
import { MainMenu } from '@/components/Scene/MainMenu';
import GameUI from '@/components/Game/GameUI';
import { AUTO, Game } from 'phaser';
import { Preloader } from '@/components/Scene/Preloader';

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

import GameUI from './game-ui';
import { AUTO, Game } from 'phaser';
import { GameOver, MainGame, MainMenu, Preloader } from "../scene";
import { Boot } from './boot';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.screen.width,
    height: window.screen.height,
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
    },    
};

const RootMenu = (parent: string) => {

    return new Game({ ...config, parent });

}

export default RootMenu;

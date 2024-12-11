import GameUI from './game-ui';
import { AUTO, Game } from 'phaser';
import { GameOver, MainGame, MainMenu, Preloader, Credits } from "../scene";
import { Boot } from './boot';
import StoryLine from './story-line';

const getMaxScreen = () => {
    if(window.screen.width > 1000) {
        return {
            width: 1000,
            height: 768
        };
    }
    return {
        width: window.screen.width,
        height: window.screen.height,    
    };
};
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: getMaxScreen().width,
    height: getMaxScreen().height,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,            
        },
      },   
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver,
        GameUI,
        StoryLine,
        MainMenu,
        Credits,
    ],
    scale: {
//        zoom:2
    },    
};

const RootMenu = (parent: string) => {

    return new Game({ ...config, parent });

}

export default RootMenu;

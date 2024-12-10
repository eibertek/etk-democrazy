import { EventBus } from '../../game/event-bus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameOverText? : Phaser.GameObjects.Text;
    button?: Phaser.GameObjects.Text;
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {        
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);
        const originX = this.sys.game.device.input.touch ? 100 : 300 ;
        const originY = this.sys.game.device.input.touch ? 100 : 300 ;
        const maxSize = this.sys.game.device.input.touch ? 40 : 64 ;
 
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(originX, originY, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: maxSize, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setDepth(100);
        
        this.button = this.add.text(originX + maxSize, originY + maxSize*2, 'Volver a Jugar', {
            fontFamily: 'Arial Black', fontSize: maxSize-10, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setDepth(100);
        this.button.setInteractive();
       
        this.button.on('pointerdown', ()=> this.scene.start('FirstMap'));

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}

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

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(300, 300, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setDepth(100);
        
        this.button = this.add.text(350, 400, 'Volver a Jugar', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
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

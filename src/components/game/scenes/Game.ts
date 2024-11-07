import { init, move } from '../character/player';
import { initWalls } from '../character/sprites';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;
    milei?: Scene;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        this.keys = this.input.keyboard?.createCursorKeys();
        init(this);
        initWalls(this);
        
        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number): void {
        move(this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}

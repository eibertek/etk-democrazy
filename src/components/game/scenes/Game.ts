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
       // this.camera.setBackgroundColor(0x00ff00);

        // this.background = this.add.image(512, 384, 'background');
        // this.background.setAlpha(0.5);
        this.keys = this.input.keyboard?.createCursorKeys();
       // initWalls(this);

        this.map = this.make.tilemap({ key: 'city' });
        this.tileset = this.map.addTilesetImage('city', 'tiles');
        this.floorLayer = this.map.createLayer('Floor', this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer('Objects', this.tileset);
        
        init(this);        

        // this.physics.world.setBounds(0, 0, this.floorLayer.width, this.floorLayer.height);

        // this.physics.world.setBounds(0, 0, 2000, this.game.config.height);
        // this.cameras.main.setBounds(0, 0, 2000, this.game.config.height);
        this.cameras.main.startFollow(this.milei);
        this.wallsLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.milei, this.wallsLayer);
        // this.milei.body.setCollideWorldBounds(true);
        
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });       
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

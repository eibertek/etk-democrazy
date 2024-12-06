import { createCharacterAnims } from '../../anims/character-anims';
// import { init, move } from './src/components/Game/character/player';
import { EventBus } from '../../game/event-bus';
import { Scene } from 'phaser';

import "../../character/milei";
import Milei from "../../character/milei";
import { firstMapStoryLine } from '../../story-line/first-map';

export class Game extends Scene
{
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    milei?: Milei;
    map?: Phaser.Tilemaps.Tilemap;
    tileset?: Phaser.Tilemaps.Tileset | null;
    floorLayer?: Phaser.Tilemaps.TilemapLayer | null;
    wallsLayer?: Phaser.Tilemaps.TilemapLayer | null;
    objectsLayer?: Phaser.Tilemaps.TilemapLayer | null;
    coins?: number;
    enemies?: unknown;

    constructor ()
    {
        super('FirstMap');
    }

    buildMobileControls() {
        this.input.addPointer(2);
        //@ts-expect-error unknoiwn type
        const joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 100,
            y: 150,
            radius: 50,
            // base: this.add.circle(0, 0, 100, 0x888888),
            // thumb: this.add.circle(0, 0, 50, 0xcccccc),
            dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true            
        });

        this.cursors = joyStick.createCursorKeys();
        this.add.circle(this.scale.width-100, this.scale.height-150, 50).setStrokeStyle(2, 0xff0000).setDepth(500)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown',  () => {
            this.milei!.isAttacking = true;            
        })
        .on('pointerup',  () => {
            this.milei!.isAttacking = false;
        });
    }

    preload()
    {

    }

    debugMode() {
        // const debugGraphics = this.add.graphics().setAlpha(0.7);
        // this.wallsLayer.renderDebug(debugGraphics, {
        //   tileColor: null,
        //   collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        // });       
        // this.objectsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //   });  
    }
    runActions () {        
      //  this.add.sprite(35,this.scale.height-215,'dialog_box', 1).setOrigin(0);
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.coins = 0;
		createCharacterAnims(this.anims)
        const hola = this.sound.add("hola", { loop: false });
		hola.play();
        this.map = this.make.tilemap({ key: 'city_tiles' });
        this.tileset = this.map.addTilesetImage('city_tiles', 'firstmap');
        if(this.tileset) {
            this.floorLayer = this.map.createLayer('floor', this.tileset);
            this.wallsLayer = this.map.createLayer('walls', this.tileset);
            //@ts-expect-error milei is an object 
            this.milei = this.add.milei(90,240,'milei');

            this.objectsLayer = this.map.createLayer('objects', this.tileset)?.setDepth(200);
        }

        this.physics.world.setBounds(0, 0, this.floorLayer!.width, this.floorLayer!.height);
        this.milei!.setCollideWorldBounds(true);
        
        this.cameras.main.startFollow(this.milei!);
        this.wallsLayer!.setCollisionByProperty({collides: true});
        this.objectsLayer!.setCollisionByProperty({collides: true});
        

        if (this.sys.game.device.input.touch) {
            this.buildMobileControls()
        } 
        this.cursors = this.input!.keyboard!.createCursorKeys();
        
        this.scene.run('game-ui');
        this.scene.launch('story-line', { scene: this, storyline: firstMapStoryLine(this), cursors:this.cursors});

        EventBus.emit('current-scene-ready', this);
    }
    
    update(): void {
      this.milei?.update(this.cursors!);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}

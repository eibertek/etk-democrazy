import { createCharacterAnims } from '../../anims/character-anims';
// import { init, move } from './src/components/Game/character/player';
import { EventBus } from '../../game/event-bus';
import { Scene } from 'phaser';

import "../../character/milei";
import Milei from "../../character/milei";
import Hrl from '../../character/hrl';

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
    lizards?: unknown;

    constructor ()
    {
        super('FirstMap');
    }

    preload()
    {
		this.cursors = this.input.keyboard?.createCursorKeys()
    }

    create ()
    {
        this.scene.run('game-ui')
        this.camera = this.cameras.main;
        this.coins = 0;
		createCharacterAnims(this.anims)

        this.map = this.make.tilemap({ key: 'city_tiles' });
        this.tileset = this.map.addTilesetImage('city_tiles', 'firstmap');
        if(this.tileset) {
            this.floorLayer = this.map.createLayer('floor', this.tileset);
            this.wallsLayer = this.map.createLayer('walls', this.tileset);
            this.milei = this.add.milei(90,240,'milei');

            this.objectsLayer = this.map.createLayer('objects', this.tileset)?.setDepth(200);
        }


		this.lizards = this.physics.add.group({
			classType: Hrl,
			createCallback: (go) => {
				const lizGo = go as Hrl
				lizGo.body.onCollide = true
			}
		})

        const lizardsLayer = this.map.getObjectLayer('lizards')
		lizardsLayer?.objects.forEach(lizObj => {
			this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'hrl')
		});

        this.physics.world.setBounds(0, 0, this.floorLayer.width, this.floorLayer.height);

        this.cameras.main.startFollow(this.milei);
        this.wallsLayer.setCollisionByProperty({collides: true});
        this.objectsLayer.setCollisionByProperty({collides: true});
        
        this.physics.add.collider(this.milei, this.wallsLayer);
        this.physics.add.collider(this.milei, this.objectsLayer);
        
        this.physics.add.collider(this.milei, this.lizards, (milei, lizard)=>{
            if(this.milei.isAttacking) {
                this.milei?.addCoins(10);
                lizard.damage();
                EventBus.emit('player-coins-changed', this.milei.getCoins());
               // EventBus.emit('player-punch');
            }else{
                EventBus.emit('player-health-changed', 1);
            }
        });

        // const debugGraphics = this.add.graphics().setAlpha(0.7);
        // this.wallsLayer.renderDebug(debugGraphics, {
        //   tileColor: null,
        //   collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        // });       
        // this.objectsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //   });         
        EventBus.emit('current-scene-ready', this);
    }
    
    update(): void {
      this.milei?.update(this.cursors);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
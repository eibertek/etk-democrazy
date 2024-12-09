import * as Phaser from 'phaser'
import { EventBus } from './event-bus';
import Hrl from '../character/hrl';
import { Game } from '../scene/first-map';
import Milei from '../character/milei';
import { IFirstMapProps, IStory } from '../story-line/first-map';

const textVariant = (size=30, color="#ffffff") => ({
	fontFamily: 'Arial', fontSize: size, color,
});

const legends = ["Peguele presidente", 'Vamo javoooo', 'toma, alien con s**a', 'UUUHHHH'];
const getLegend = () => legends[Math.floor(Math.random()*legends.length)];

export class StoryLine extends Phaser.Scene
{

	public legend?: Phaser.GameObjects.Text[];
    private map?: Phaser.Tilemaps.Tilemap;
    private currentScene?: Game;
    private npcs?: Phaser.Physics.Arcade.StaticGroup;
    private enemies?: Phaser.Physics.Arcade.Group;
    public TIME_PAUSE: boolean = false;
    private grayOverlay?: Phaser.GameObjects.Rectangle;
    public dialogBox?: Phaser.GameObjects.Sprite;
    private activeNPC?: Phaser.GameObjects.Sprite | Phaser.GameObjects.GameObject;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private storyline?: IFirstMapProps;
    private activeStory?: IStory[];
    private activeStoryIdx:number = -1;
	constructor()
	{
		super({ key: 'story-line' });
 	}

    init({ scene, storyline, cursors }:{scene: Game, storyline: IFirstMapProps, cursors: Phaser.Types.Input.Keyboard.CursorKeys}) {
            this.currentScene = scene;
            this.storyline = storyline;
            this.cursors = cursors;
    };

    initEnemies() {
        const scene = this.currentScene;
        const punch = this.currentScene!.sound.add("punch", { loop: false });
        if(!scene) return;
        this.enemies = scene.physics.add.group({
			classType: Hrl,
            collideWorldBounds: true, 
			createCallback: (go) => {
				const lizGo = go as Hrl
				lizGo.body!.onCollide = true
			}
		})

        const larretasLayer = scene.map!.getObjectLayer('larretas')
		larretasLayer?.objects.forEach(lizObj => {
			this.enemies!.create(lizObj.x!, lizObj.y!, 'hrl');         
		});
        if(scene.milei && scene.wallsLayer && scene.objectsLayer ) {
            scene.physics.add.collider(scene.milei, scene.wallsLayer);
            scene.physics.add.collider(scene.milei, scene.objectsLayer);    

            scene.physics.add.collider(this.enemies, scene.wallsLayer);
            scene.physics.add.collider(this.enemies, scene.objectsLayer);

            scene.physics.add.overlap(scene.milei, this.enemies, (milei, larreta)=>{
                if(this.sys.game.device.input.touch) {
                    const bottomY = this.cameras.main.worldView.y + this.cameras.main.height - 150;
                    this.dialogBox!.setScale(0.5, 0.5).setY(bottomY);                    
                    this.legend![0].setY(bottomY).setX(140);
                    this.legend![1].setY(bottomY+40).setX(140);                     
                }
                if(!this.dialogBox!.visible) {
                    this.dialogBox!.setVisible(true);
                    this.legend?.forEach(legend => legend.setVisible(true));    
                }                
                if((milei as Milei).isAttacking) {
                    scene.milei?.addCoins(10);
                    (larreta as Hrl).damage();
                    this.dialogBox!.setFrame(1);
                    punch.play();
                    EventBus.emit('player-coins-changed', (milei as Milei).getCoins());
                   // EventBus.emit('player-punch');
                }else{
                    EventBus.emit('player-health-changed', 1);                    
                    this.dialogBox!.setFrame(2);
                    (milei as Milei).handleDamage();
                    setTimeout(()=>{
                        this.dialogBox!.setVisible(false);
                        this.legend?.forEach(legend => legend.setVisible(false));
                    }, 2000);                    
                }

            });
    
        }

        setTimeout(()=>{
            this.enemies!.children.entries.map((liz)=>{
                //@ts-expect-error activeNpc
                liz.body.setSize(liz.width-5, liz.height-5, true);
            });
        },1000);        
    }

    initStoryline(){
        const slItemsLayer = this.currentScene!.map!.getObjectLayer('NPC');
        const slObjectivesLayer = this.currentScene!.map!.getObjectLayer('objective points');
        this.npcs = this.currentScene!.physics.add.staticGroup();
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		if(this.scale.orientation.toString()==='portrait-primary') {
            this.grayOverlay!.setVisible(true);
            this.add.text(screenCenterX, screenCenterY, `este juego se juega`, textVariant(30, "#000000")).setOrigin(0.5);
            this.add.text(screenCenterX, screenCenterY+ 40, `en landscape`, textVariant(30, "#000000")).setOrigin(0.5);
            this.add.text(screenCenterX, screenCenterY + 80, 'voltea el celu', textVariant(30, "#000000")).setOrigin(0.5);
            this.currentScene!.physics.world.pause();
		}
		slItemsLayer?.objects.forEach(slObj => {
			const npc = this.npcs!.create(slObj.x!, slObj.y!, slObj.name);
            npc.body.setSize(slObj.width, slObj.height);
            npc.setAlpha(0);
            npc.name = slObj.name;
            const event = this.storyline!.events.filter(st => st.id === slObj.name).shift();
            if(event!.actions) {
               // event.actions(slObj.x!, slObj.y!);
               event!.actions(npc);
            }
		});

        slObjectivesLayer?.objects.forEach(slObj => {
			const npc = this.npcs!.create(slObj.x!, slObj.y!, slObj.name);
            npc.body.setSize(slObj.width, slObj.height);
            npc.setAlpha(0);
            npc.name = slObj.name;
            const event = this.storyline!.events.filter(st => st.id === slObj.name).shift();
            if(event && event!.actions) {
               // event.actions(slObj.x!, slObj.y!);
               event!.actions(npc);
            }
		});

        if(this.currentScene?.milei) {
            this.currentScene!.physics.add.overlap(this.currentScene.milei, this.npcs, (milei, npc)=>{   
                const repeatable = this.activeNPC?.getData("repeatable") || false;
                if(repeatable && this.activeNPC?.getData("status")===1) {
                    setTimeout(()=>{
                        this.activeNPC?.setData("status", 0);    
                    }, 5000);
                    return;
                };
                this.grayOverlay!.setVisible(true);
                this.currentScene!.physics.world.pause();
                //@ts-expect-error name
                const event = this.storyline!.events.filter(st => st.id === npc.name).shift();
                if(!this.activeNPC) {
                    //@ts-expect-error activeNpc
                    this.activeNPC = npc;
                    this.activeNPC?.setData("status", 0);                
                    this.activeNPC?.setData("repeatable", !!event!.repeatable || false);
                }
                this.activeStory = event!.story;
                this.activeStoryIdx = 0;
                this.runStory();
            });
    
        }
    }

    runStory(){
        if(!this.dialogBox!.visible) {
            this.dialogBox!.setVisible(true);
            this.legend?.forEach(legend => legend.setVisible(true));    
        }
        if(this.sys.game.device.input.touch) {
            const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2 - 90;
            this.dialogBox!.setScale(1, 1).setY(screenCenterY);
            this.legend![0].setY(screenCenterY).setX(220);
            this.legend![1].setY(screenCenterY+40).setX(220);    
        }
        const story = this.activeStory![this.activeStoryIdx];
        if(!story) return;
        const legend = story.text.split(" ");
        this.legend![0].setText(legend.slice(0,5).join(" "));
        this.legend![1].setText(legend.slice(5).join(" "));
        this.dialogBox!.setFrame(story.avatarNumber);
    }

    resumeStory(){
        if(this.activeStoryIdx < this.activeStory!.length){
            this.activeStoryIdx++;
            this.runStory();
        }else{
            const repeatable = this.activeNPC?.getData("repeatable") || false;
            if(!repeatable){
                this.activeNPC!.destroy();
                this.activeNPC = undefined;
            }else{
                this.activeNPC?.setData("status", 1);
            }
            this.activeStory = [];
            this.activeStoryIdx = 0;
            this.grayOverlay!.setVisible(false);
            this.legend!.forEach(t=> t.setText(""));
            this.dialogBox!.setFrame(5);                    
            this.currentScene!.physics.world.resume();
        }
    };

	create()
	{
        const offsetY = this.sys.game.device.input.touch ? 260 : 215;
        const offsetTextY = this.sys.game.device.input.touch ? 260 : 100;
        const offsetX = this.sys.game.device.input.touch ? 220 : 240;
        const fontSize = this.sys.game.device.input.touch ? 25 : 30;
        // image placeholder
        this.dialogBox = this.add.sprite(35,this.scale.height-offsetY,'dialog_box', 5).setOrigin(0).setDepth(300);
        this.grayOverlay = this.add.rectangle(0,0,3000, 3000,0x000000, 0.2)
        .setVisible(false)
        .setInteractive()
        .on('pointerdown', ()=>{
            this.resumeStory();
        });
        this.legend = [
            this.add.text(offsetX, this.scale.height-offsetTextY, "", textVariant(fontSize)).setDepth(300),
            this.add.text(offsetX, this.scale.height-offsetTextY+40, "", textVariant(fontSize)).setDepth(300)
        ];        
        this.initEnemies();
        EventBus.on('player-kills', this.handleLegendChange, this);
        EventBus.on('run-story', this.runStory, this);

        this.initStoryline();

        // this.add.rectangle(35,this.scale.height-215,180,180, 0xFFFFFF).setOrigin(0).setDepth(1000);
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			EventBus.off('player-kills')
		})
    }

    update(){
        if (!this.currentScene!.sys.game.device.input.touch) {
            if(this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                if(this.currentScene!.physics.world.isPaused){
                    this.resumeStory();
                }
            }
        }
    }

	private handleLegendChange = () => {
        const vivalibertad = this.currentScene!.sound.add("viva", { loop: false });
        vivalibertad.play();
        const legend = getLegend();
        this.legend![0].setText(legend.slice(0,30));
        this.legend![1].setText(legend.slice(30));
	};

}

export default StoryLine;
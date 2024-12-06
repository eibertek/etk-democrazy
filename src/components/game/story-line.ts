import * as Phaser from 'phaser'
import { EventBus } from './event-bus';
import Hrl from '../character/hrl';

const textVariant = (size=30, color="#ffffff") => ({
	fontFamily: 'Arial', fontSize: size, color,
});

const legends = ["Peguele presidente", 'Vamo javoooo', 'toma, alien con s**a', 'UUUHHHH'];
const getLegend = () => legends[Math.floor(Math.random()*legends.length)];

export class StoryLine extends Phaser.Scene
{

	public legend?: Phaser.GameObjects.Text[];
    private map?: Phaser.Tilemaps.Tilemap;
    private scene?: Phaser.Scene;
    private npcs?: Phaser.Physics.Arcade.StaticGroup;
    private enemies?: Phaser.Physics.Arcade.Group;
    public TIME_PAUSE: boolean = false;
    private grayOverlay: Phaser.GameObjects.Rectangle;
    public dialogBox?: Phaser.GameObjects.Sprite;
    private activeNPC?;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stories = {};
    private activeStory = [];
    private activeStoryIdx:number = -1;
	constructor()
	{
		super({ key: 'story-line' });
 	}

    init({ scene, storyline, cursors }:{scene: Phaser.Scene, storyline: unknown, cursors: Phaser.Types.Input.Keyboard.CursorKeys}) {
            this.scene = scene;
            this.storyline = storyline;
            this.cursors = cursors;
    };

    initEnemies() {
        const scene = this.scene;
        const punch = this.scene.sound.add("punch", { loop: false });
        if(!scene) return;
        scene.enemies = scene.physics.add.group({
			classType: Hrl,
			createCallback: (go) => {
				const lizGo = go as Hrl
				lizGo.body.onCollide = true
			}
		})

        const larretasLayer = scene.map.getObjectLayer('larretas')
		larretasLayer?.objects.forEach(lizObj => {
			scene.enemies.create(lizObj.x!, lizObj.y!, 'hrl');            
		});

        scene.physics.add.collider(scene.milei, scene.wallsLayer);
        scene.physics.add.collider(scene.milei, scene.objectsLayer);

        scene.physics.add.collider(scene.enemies, scene.wallsLayer);
        scene.physics.add.collider(scene.enemies, scene.objectsLayer);

        scene.physics.add.overlap(scene.milei, scene.enemies, (milei, larreta)=>{
            if(milei.isAttacking) {
                scene.milei?.addCoins(10);
                larreta.damage();
                this.dialogBox.setFrame(1);
                punch.play();
                EventBus.emit('player-coins-changed', milei.getCoins());
               // EventBus.emit('player-punch');
            }else{
                EventBus.emit('player-health-changed', 1);
                this.dialogBox.setFrame(2);
                scene.milei.handleDamage();
            }
        });


        setTimeout(()=>{
            scene.enemies.children.entries.map((liz)=>{
                liz.body.setSize(liz.width-5, liz.height-5, true);
            });
        },1000);        
    }

    initStoryline(){
        const slItemsLayer = this.scene.map.getObjectLayer('NPC');
        this.npcs = this.scene.physics.add.staticGroup();
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		if(this.scale.orientation.toString()==='portrait-primary') {
            this.grayOverlay.setVisible(true);
            this.add.text(screenCenterX, screenCenterY, `este juego se juega`, textVariant(30, "#000000")).setOrigin(0.5);
            this.add.text(screenCenterX, screenCenterY+ 40, `en landscape`, textVariant(30, "#000000")).setOrigin(0.5);
            this.add.text(screenCenterX, screenCenterY + 80, 'voltea el celu', textVariant(30, "#000000")).setOrigin(0.5);
            this.scene.physics.world.pause();
		}
		slItemsLayer?.objects.forEach(slObj => {
			const npc = this.npcs.create(slObj.x!, slObj.y!, slObj.name);
            npc.body.setSize(slObj.width, slObj.height);
            npc.setAlpha(0);
            npc.name = slObj.name;
            const event = this.storyline.events.filter(st => st.id === slObj.name).shift();
            if(event.actions) {
               // event.actions(slObj.x!, slObj.y!);
               event.actions(npc);
            }
		});

        this.scene.physics.add.overlap(this.scene.milei, this.npcs, (milei, npc)=>{
            this.grayOverlay.setVisible(true);
            this.scene.physics.world.pause();
            this.activeNPC = npc;
            const event = this.storyline.events.filter(st => st.id === npc.name).shift();
            this.activeStory = event.story;
            this.activeStoryIdx = 0;
            this.runStory();
        });

    }

    runStory(){
        const story = this.activeStory[this.activeStoryIdx];
        if(!story) return;
        const legend = story.text.split(" ");
        this.legend[0].setText(legend.slice(0,5).join(" "));
        this.legend[1].setText(legend.slice(5).join(" "));
        this.dialogBox.setFrame(story.avatarNumber);
    }

    resumeStory(){
        if(this.activeStoryIdx < this.activeStory.length){
            this.activeStoryIdx++;
            this.runStory();
        }else{
            this.activeNPC.destroy();
            this.activeStory = [];
            this.activeStoryIdx = 0;
            this.grayOverlay.setVisible(false);
            this.legend.forEach(t=> t.setText(""));
            this.dialogBox.setFrame(5);                    
            this.scene.physics.world.resume();
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
        if (!this.scene.sys.game.device.input.touch) {
            if(this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                if(this.scene.physics.world.isPaused){
                    this.resumeStory();
                }
            }
        }
    }

	private handleLegendChange = () => {
        const vivalibertad = this.scene.sound.add("viva", { loop: false });
        vivalibertad.play();
        const legend = getLegend();
        this.legend[0].setText(legend.slice(0,30));
        this.legend[1].setText(legend.slice(30));
	};

}

export default StoryLine;
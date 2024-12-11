import * as Phaser from 'phaser'
import { EventBus } from './event-bus';

const textVariant = (size=30, color="#ffffff") => ({
	fontFamily: 'Arial', fontSize: size, color,
});

export class GameUI extends Phaser.Scene
{
	private life!: Phaser.GameObjects.Rectangle;
	private frameUI?: Phaser.GameObjects.Image;
	private musicOn?: boolean;
	private bmg?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
	private muteButton?: Phaser.GameObjects.Text;
	constructor()
	{
		super({ key: 'game-ui' });
	}

	create()
	{
		this.musicOn = true;
		this.bmg = this.sound.add("bmg_1", { loop: true });
		this.bmg.play();
		const getWidthScale = (width:number) => {
			return this.scale.width/width
		};
		const getHeightScale = (height: number) => {
			return this.scale.height/height
		};

		if (!this.sys.game.device.input.touch) {
			this.frameUI = this.add.image(0, 0, 'frameui').setDepth(100).setOrigin(0).setScale(getWidthScale(800),getHeightScale(600));		
		}
		this.add.text(400, 20, 'Riesgo Pais', textVariant(20)).setDepth(150);
		const coinsLabel = this.add.text(410, 40, '100', textVariant(30)).setDepth(150);

		EventBus.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		this.add.rectangle(120, 30, 800, 100, 0x000000).setAlpha(0.5).setDepth(90);
		this.add.text(40, 20, 'Vida', textVariant(20)).setDepth(150);
		this.add.rectangle(120, 50, 150, 12).setStrokeStyle(1, 0xffffff).setDepth(150);
		this.life = this.add.rectangle(120, 50, 150, 12, 0xDDDDFF).setDepth(160);

		EventBus.on('player-health-changed', this.handlePlayerHealthChanged, this);

		this.muteButton = this.add.text(this.scale.width - 150, 20, `Music ${this.musicOn ? 'On' : 'Off'}`, textVariant(30, "#000000"))
		.setOrigin(0)
		.setDepth(150)
		.setInteractive()
		.on('pointerdown',()=>{
			this.musicOn = !this.musicOn;
			this.muteButton!.setText(`Music ${this.musicOn ? 'On' : 'Off'}`);
			if(this.musicOn) {
				this.bmg!.setVolume(0.5).play();
			}else{
				this.bmg!.setVolume(0.5).stop();
			}
	
		});

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			EventBus.off('player-health-changed', this.handlePlayerHealthChanged, this)
			EventBus.off('player-coins-changed')
			this.bmg?.stop();
		})

	}

	private handlePlayerHealthChanged(health: number)
	{		

		if(health > 0) {
			this.life.width = health;
			this.life.setFillStyle(0xFFFFFF);
			if(this.life.width < 70 ) {
				this.life.setFillStyle(0xFFFF00);
			}
			if(this.life.width < 30 ) {
				this.life.setFillStyle(0xFF0000);
			}
		}else{
			this.time.addEvent({
				delay: 1000,
				callback: () => {
					this.scene.stop('story-line');
					this.scene.start('GameOver');
				},
				loop: true
			});
		}
	}
}

export default GameUI;
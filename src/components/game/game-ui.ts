import * as Phaser from 'phaser'
import { EventBus } from './event-bus';

const textVariant = (size=30) => ({
	fontFamily: 'Arial', fontSize: size, color: '#ffffff',
});

export class GameUI extends Phaser.Scene
{
	private life!: Phaser.GameObjects.Rectangle;
	private frameUI?: Phaser.GameObjects.Image;

	constructor()
	{
		super({ key: 'game-ui' });
	}

	create()
	{
		const getWidthScale = (width:number) => {
			return this.scale.width/width
		};
		const getHeightScale = (height: number) => {
			return this.scale.height/height
		};

		if (!this.sys.game.device.input.touch) {
			this.frameUI = this.add.image(0, 0, 'frameui').setDepth(100).setOrigin(0).setScale(getWidthScale(800),getHeightScale(600));		
		}
		this.add.text(400, 20, 'Coins', textVariant(20));
		const coinsLabel = this.add.text(410, 40, '100', textVariant(30));

		EventBus.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		this.add.text(40, 20, 'Life', textVariant(20));
		this.add.rectangle(200, 50, 150, 12).setStrokeStyle(1, 0xffffff).setDepth(150);
		this.life = this.add.rectangle(200, 50, 150, 12, 0xDDDDFF).setDepth(160);

		EventBus.on('player-health-changed', this.handlePlayerHealthChanged, this);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			EventBus.off('player-health-changed', this.handlePlayerHealthChanged, this)
			EventBus.off('player-coins-changed')
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
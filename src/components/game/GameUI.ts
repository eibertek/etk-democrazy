import * as Phaser from 'phaser'
import { EventBus } from './EventBus'

const textVariant = (size=30) => ({
	fontFamily: 'Arial', fontSize: size, color: '#ffffff',
});

const legends = ["Peguele presidente", 'Vamo javoooo', 'toma, alien con s**a', 'UUUHHHH'];
const getLegend = () => legends[Math.floor(Math.random()*legends.length)];

export class GameUI extends Phaser.Scene
{
	private life!: Phaser.GameObjects.Group
	private frameUI?: Phaser.GameObjects.Image;
	public legend: Phaser.GameObjects.Text;

	constructor()
	{
		super({ key: 'game-ui' });
		this.legend = this.add.text(200, 530, getLegend(), textVariant(30));
	}

	create()
	{
        this.frameUI = this.add.image(400, 300, 'frameui').setDepth(100);
		this.add.text(200, 20, 'Coins', textVariant(20));
		const coinsLabel = this.add.text(210, 40, '100', textVariant(30));

		EventBus.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		this.add.text(40, 20, 'Life', textVariant(20));
		this.add.rectangle(100, 50, 100, 12).setStrokeStyle(1, 0xffffff).setDepth(150);
		this.life = this.add.rectangle(100, 50, 100, 12, 0xDDDDFF).setDepth(160);

		EventBus.on('player-health-changed', this.handlePlayerHealthChanged, this);
		EventBus.on('player-kills', this.handleLegendChange, this);

		this.legend = this.add.text(200, 530, getLegend(), textVariant(30)).setDepth(300);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			EventBus.off('player-health-changed', this.handlePlayerHealthChanged, this)
			EventBus.off('player-coins-changed')
		})
	}

	private handleLegendChange = () => {
		this.legend.setText(getLegend());
	};

	private handlePlayerHealthChanged(health: number)
	{
		if(this.life.width > 0) {
			this.life.width-=health;
			if(this.life.width < 50 ) {
				this.life.setFillStyle(0xFFFF00);
			}
			if(this.life.width < 20 ) {
				this.life.setFillStyle(0xFF0000);
			}
		}
	}
}

export default GameUI;
import * as Phaser from 'phaser'
import { EventBus } from '../game/event-bus'

enum Direction
{
	UP,
	DOWN,
	LEFT,
	RIGHT
}

const randomDirection = (exclude: Direction) => {
	let newDirection = Phaser.Math.Between(0, 3)
	while (newDirection === exclude)
	{
		newDirection = Phaser.Math.Between(0, 3)
	}

	return newDirection
}

export default class Hrl extends Phaser.Physics.Arcade.Sprite
{
	private direction = Direction.RIGHT
	private moveEvent: Phaser.Time.TimerEvent
	private health: number;

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		// this.anims.play('hrl-idle')

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		this.moveEvent = scene.time.addEvent({
			delay: 2000,
			callback: () => {
				this.direction = randomDirection(this.direction)
			},
			loop: true
		});
		this.health = 20;
		this.body?.setSize(this.width, this.height,);
	}

	create() {
		this.setCollideWorldBounds(true);
	}

	destroy(fromScene?: boolean)
	{
		this.moveEvent.destroy()

		super.destroy(fromScene)
	}

	damage = () => {
		this.health-=1;
		this.setTint(0xff0000);	
		this.scene.time.addEvent({
			delay: 500,
			callback: () => {
				this.setTint(0xffffff);	
				this.direction = randomDirection(this.direction)
			},
		});			
		if(this.health<0) {
			this.destroy();
			EventBus.emit('player-kills');
		}
	};
	private handleTileCollision(go: Phaser.GameObjects.GameObject)
	{
		if (go !== this)
		{
			return
		}

		this.direction = randomDirection(this.direction)
	}

	preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		const speed = !this.scene.TIME_PAUSE ? 100 : 0;

		switch (this.direction)
		{
			case Direction.UP:
				this.setVelocity(0, -speed)
				this.anims.play('hrl-walk-up', true)
				break

			case Direction.DOWN:
				this.setVelocity(0, speed)
				this.anims.play('hrl-walk-down', true)
				break

			case Direction.LEFT:
				this.setVelocity(-speed, 0)
				this.anims.play('hrl-walk', true)
				this.flipX = false;				
				break

			case Direction.RIGHT:
				this.setVelocity(speed, 0)
				this.anims.play('hrl-walk', true)
				this.flipX = true;
				break
		}
	}
};

Phaser.GameObjects.GameObjectFactory.register('hrl', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	const sprite = new Hrl(this.scene, x, y, texture, frame);

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	// sprite.body?.setSize(sprite.width, sprite.height)

	return sprite;
});


import * as Phaser from 'phaser'
import { EventBus } from '../game/event-bus';

enum HealthState
{
	IDLE,
	DAMAGE,
	DEAD
}

export default class Milei extends Phaser.Physics.Arcade.Sprite
{
	private healthState = HealthState.IDLE
	private damageTime = 0

	private _health = 150
	private _coins = 0;
    private orientation = "down";
    public isAttacking = false;
	private pause:boolean = false;
	get health()
	{
		return this._health
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

        this.anims.play('milei-idle', true);
	}

	init(){

	}
	
	handleDamage(damage: number)
	{
		if (this._health <= 0)
		{
			return
		}

		if (this.healthState === HealthState.DAMAGE)
		{
			return
		}

		this._health-=damage;

		if (this._health <= 0)
		{
			// TODO: die
			this.healthState = HealthState.DEAD
			this.anims.play('milei-faint')
			this.setVelocity(0, 0)
		}
		else
		{

			this.setTint(0xff0000)

			this.healthState = HealthState.DAMAGE
			this.damageTime = 0
		}
	}

	refillLife = () => {
		this._health = 150;
		EventBus.emit('player-health-changed', this._health);                    
	}

	getHealth = () => {
		return this._health;
	}

	addCoins = (coins:number) => {
		this._coins+=coins;
	}

	getCoins = () => this._coins;

	preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		switch (this.healthState)
		{
			case HealthState.IDLE:
				break

			case HealthState.DAMAGE:
				this.damageTime += dt
				if (this.damageTime >= 250)
				{
					this.healthState = HealthState.IDLE
					this.setTint(0xffffff)
					this.damageTime = 0
				}
				break
		}
	}

	attack() {
		this.setVelocity(0, 0);
		this.body!.setSize(this.width+10, this.height+10, true);		
		this.isAttacking = true;
		if (this.orientation==="left")
			{
				this.anims.play('milei-fight', true);
				this.flipX =false;
			}
			else if (this.orientation==="right")
			{
				this.anims.play('milei-fight', true);
				this.flipX =true;
			}
			else if (this.orientation==="up")
			{
				this.anims.play('milei-fight-up', true);
			}
			else if (this.orientation==="down")
			{
				this.anims.play('milei-fight-down', true);
			}
	}

	update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		if(this.pause) return;
		if (this.healthState === HealthState.DAMAGE
			|| this.healthState === HealthState.DEAD
		)
		{
			return
		}

		if (!cursors)
		{
			return
		}
		const leftDown = cursors.left?.isDown
		const rightDown = cursors.right?.isDown
		const upDown = cursors.up?.isDown
		const downDown = cursors.down?.isDown
        const spaceDown = cursors.space?.isDown;
        const spaceUp = cursors.space?.isUp;

        const speed = 400
		if (spaceUp) {
            this.isAttacking = false;
			this.body!.setSize(this.width-5, this.height-5, true);		
		}
		if (spaceDown || this.isAttacking)
		{
          this.attack();
		}		
        else if (leftDown)
		{
			this.anims.play('milei-walk', true)
			this.setVelocity(-speed, 0)
            this.flipX =false;
            this.orientation = "left";

		}
		else if (rightDown)
		{
			this.anims.play('milei-walk', true)
			this.setVelocity(speed, 0)
            this.flipX =true;
            this.orientation = "right";
		}
		else if (upDown)
		{
			this.anims.play('milei-walk-up', true)
			this.setVelocity(0, -speed);
            this.orientation = "up";
		}
		else if (downDown)
		{
			this.anims.play('milei-walk-down', true)
			this.setVelocity(0, speed);
            this.orientation = "down";
		}
		else
		{
			this.anims.play('milei-idle', true)
            this.isAttacking = false;
			this.setVelocity(0, 0)
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('milei', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	const sprite = new Milei(this.scene, x, y, texture, frame);

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8)

	return sprite;
});

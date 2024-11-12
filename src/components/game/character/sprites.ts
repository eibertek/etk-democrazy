import { Scene } from "phaser";

interface PlayerProps extends Scene {
    milei?: Phaser.GameObjects.Sprite;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;
    walls?: Phaser.Physics.Arcade.StaticGroup;
}

export const initWalls = (game: PlayerProps) => {
    game.walls = game.physics.add.staticGroup();

    game.walls
    .create(0, game.game.config.height - 400, 'walls')
    .setOrigin(0, 0.5)
    .setSize(10,400)    
    .refreshBody()

    game.walls
    .create(20, game.game.config.height - 400, 'walls')
    .setOrigin(0, 0.5)
    .setSize(10,400)    
    .refreshBody()


}



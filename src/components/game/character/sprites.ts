import { Scene } from "phaser";

interface PlayerProps extends Scene {
    milei?: Phaser.GameObjects.Sprite;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;
}

export const initWalls = (game: PlayerProps) => {
    game.walls = game.physics.add.staticGroup();

    game.walls
    .create(0, game.game.config.height - 100, 'walls')
    .setOrigin(0, 0.5)
    .refreshBody()

    game.walls
    .create(200, game.game.config.height - 40, 'walls')
    .setOrigin(0, 0.5)
    .refreshBody()

    game.walls
    .create(100, game.game.config.height - 20, 'walls')
    .setOrigin(0, 0.5)
    .refreshBody()

    game.physics.world.setBounds(0, 0, 2000, game.game.config.height);
    game.physics.add.collider(game.milei, game.walls, (o1, o2)=>{ console.log(o1, o2)});
  
    game.cameras.main.setBounds(0, 0, 2000, game.game.config.height);
    game.cameras.main.startFollow(game.milei);
}



import { Scene } from "phaser";

interface PlayerProps extends Scene {
    milei?: Phaser.GameObjects.Sprite;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;
}

export const init = (game: PlayerProps) => {
    game.milei = game.physics.add.sprite(100,300,'milei')
        .setCollideWorldBounds(true);
    // crear una funcion que  cargue todo lo respectivo a un nivel
    game.anims.create({ key: 'milei-walk', frames: game.anims.generateFrameNumbers('milei', { start:216, end:224}),frameRate:12, repeat:-1})
    game.anims.create({ key: 'milei-walk-up', frames: game.anims.generateFrameNumbers('milei', { start:192, end:199}),frameRate:12, repeat:-1})
    game.anims.create({ key: 'milei-walk-down', frames: game.anims.generateFrameNumbers('milei', { start:240, end:248}),frameRate:12, repeat:-1})
    game.anims.create({ key: 'milei-idle', frames: game.anims.generateFrameNumbers('milei', { start:240, end:242}),frameRate:5, repeat:-1})
};

export const move = (game: PlayerProps) => {    
    if(!game.milei) return;

    if(game.keys?.left.isDown){
        game.milei?.anims.play('milei-walk', true);
        game.milei.x-= 2;
        game.milei.flipX =false;
    }else if(game.keys?.right.isDown){
         game.milei?.anims.play('milei-walk', true);
        game.milei.x+=2;
        game.milei.flipX =true;
    }else if(game.keys?.up.isDown){
        game.milei?.play('milei-walk-up', true);
        game.milei.y-=2;
    }else if(game.keys?.down.isDown){
        game.milei?.play('milei-walk-down', true);
        game.milei.y+=2;
    }else{
        game.milei.anims.play('milei-idle', true);
    }
};



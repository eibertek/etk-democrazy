import * as Phaser from 'phaser'

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({ key: 'milei-walk', frames: anims.generateFrameNumbers('milei', { start:216, end:224}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-walk-up', frames: anims.generateFrameNumbers('milei', { start:192, end:199}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-walk-down', frames: anims.generateFrameNumbers('milei', { start:240, end:248}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-idle', frames: anims.generateFrameNumbers('milei', { start:240, end:242}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-fight', frames: anims.generateFrameNumbers('milei', { start:120, end:127}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-fight-up', frames: anims.generateFrameNumbers('milei', { start:96, end:103}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-fight-down', frames: anims.generateFrameNumbers('milei', { start:144, end:151}),frameRate:12, repeat:-1})
    anims.create({ key: 'milei-faint', frames: anims.generateFrameNumbers('milei', { start:480, end:486}),frameRate:12, repeat:0})


    //hrl
    anims.create({ key: 'hrl-walk', frames: anims.generateFrameNumbers('larreta', { start:162, end:170}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-walk-up', frames: anims.generateFrameNumbers('larreta', { start:144, end:152}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-walk-down', frames: anims.generateFrameNumbers('larreta', { start:180, end:188}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-idle', frames: anims.generateFrameNumbers('larreta', { start:180, end:182}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-fight', frames: anims.generateFrameNumbers('larreta', { start:120, end:127}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-fight-up', frames: anims.generateFrameNumbers('larreta', { start:96, end:103}),frameRate:12, repeat:-1})
    anims.create({ key: 'hrl-fight-down', frames: anims.generateFrameNumbers('larreta', { start:144, end:151}),frameRate:12, repeat:-1})

    anims.create({ key: 'morcilla-walk-down', frames: anims.generateFrameNumbers('morcilla', { start:26, end:32}),frameRate:9, repeat:-1})

    anims.create({ key: 'tipito-dancing', frames: anims.generateFrameNumbers('tipitodance', { start:0, end:17}), frameRate:9, repeat:-1})

}

export {
	createCharacterAnims
}

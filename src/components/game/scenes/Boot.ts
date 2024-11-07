import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        const text = this.add.text(200,200,"La inflacion es un fenomeno monetario");
        this.tweens.add({
            targets: text,
            x: 600,
            ease: 'Power1',
            duration: 3000,
            onComplete: () => {
                text.text = "SIEMPRE"
            }
        })

    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(300, 300, 285, 32).setStrokeStyle(1, 0xffffff).setOrigin(0);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(300, 300, 4, 32, 0xffffff).setOrigin(0);
        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (285 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('frameui', 'frame.png');
        this.load.spritesheet('milei', 'sprite_milei.png',{ frameWidth:64, frameHeight:64 });
        this.load.spritesheet('superMilei', 'spriteSuperMilei.png',{ frameWidth:64, frameHeight:64 });      
        this.load.spritesheet('larreta', 'sprite_hrl.png',{ frameWidth:64, frameHeight:64 });      
        this.load.spritesheet('dialog_box', 'dialog_box.png',{ frameWidth:180, frameHeight:180 });

        this.load.image({
            key: 'firstmap',
            url: 'firstmap/cityv2.png',
          });
        this.load.tilemapTiledJSON('city_tiles', 'firstmap/city_1_2_tm.json');

        this.load.audio("punch", ["punch.wav"]);
        this.load.audio("hola", ["leon1.wav"]);
        this.load.audio("viva", ["vivalibertad.wav"]);
        this.load.plugin('rexvirtualjoystickplugin','https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
       // this.scene.start('MainMenu');
       this.scene.start('MainMenu');       
    }
}

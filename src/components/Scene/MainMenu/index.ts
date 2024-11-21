import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../../Game/EventBus';

export class MainMenu extends Scene
{
    background?: GameObjects.Image;
    logo?: GameObjects.Image;
    title?: GameObjects.Text;
    logoTween?: Phaser.Tweens.Tween | null;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('MainMenu');        
    }
    
    onObjectClicked = (obj) => {
          this.tweens.add({
            targets: this.title,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Handle completion
                this.changeScene();              
              }            
          });
    };

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

       this.add.text(300, 200, 'El juego de Milei', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.title = this.add.text(300, 300, 'Iniciar el Juego', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.title.setInteractive();
       
        this.title.on('pointerdown',this.onObjectClicked);
        const text = this.add.text(100,400,"La inflacion es un fenomeno monetario");
        this.tweens.add({
            targets: text,
            x: 400,
            ease: 'Power1',
            duration: 3000,
            onComplete: () => {
                text.text = "SIEMPRE"
            }
        });
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('FirstMap');
    }
}

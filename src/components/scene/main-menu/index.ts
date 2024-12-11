import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../../game/event-bus';

const textVariant = ({size=30, color="#ffffff", stroke="#000000", strokeThickness=8}) => ({
	fontFamily: 'Arial', fontSize: size, color, stroke, strokeThickness
});

export class MainMenu extends Scene
{
    background?: GameObjects.Image;
    logo?: GameObjects.Image;
    title?: GameObjects.Text;
    credits?: GameObjects.Text;
    logoTween?: Phaser.Tweens.Tween | null;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('MainMenu');        
    }
    
    onObjectClicked = (object, scene="FirstMap") => {
          this.tweens.add({
            targets: object,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Handle completion
                this.changeScene(scene);              
              }            
          });
    };

    create ()
    {
       this.background = this.add.image(512, 384, 'background');
       const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
       const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

       if(this.scale.orientation.toString()==='portrait-primary') {
           this.add.text(screenCenterX, screenCenterY, `este juego se juega`, textVariant({size:30, color:"#000000", strokeThickness:1})).setOrigin(0.5);
           this.add.text(screenCenterX, screenCenterY+ 40, `en landscape`, textVariant({size:30, color:"#000000", strokeThickness:1})).setOrigin(0.5);
           this.add.text(screenCenterX, screenCenterY + 80, 'voltea el celu', textVariant({size:30, color:"#000000", strokeThickness:1})).setOrigin(0.5);
       }else{
           this.add.text(screenCenterX, screenCenterY-50, 'El juego de Milei', textVariant({size:50, strokeThickness:8})).setOrigin(0.5).setDepth(100);
           this.title = this.add.text(screenCenterX, screenCenterY + 20, '> Iniciar el Juego < ',  textVariant({size:40, strokeThickness:8})).setOrigin(0.5).setDepth(100);
           this.add.text(screenCenterX, screenCenterY+80, 'Te mueves con las flechitas y pegas con space.', textVariant({size:20, strokeThickness:5})).setOrigin(0.5).setDepth(100);

           this.credits = this.add.text(screenCenterX, screenCenterY + 130, 'ver creditos ',  textVariant({size:40, strokeThickness:8})).setOrigin(0.5).setDepth(100);
           
         this.title.setInteractive();
         this.title.on('pointerdown',()=>this.onObjectClicked(this.title, 'FirstMap'));

         this.credits.setInteractive();
         this.credits.on('pointerdown',()=>this.onObjectClicked(this.credits, 'Credits'));

         const text = this.add.text(screenCenterX-400, screenCenterY+100,"La inflacion es un fenomeno monetario");
         this.tweens.add({
             targets: text,
             x: screenCenterX-100,
             ease: 'Power1',
             duration: 3000,
             onComplete: () => {
                 text.text = `${text.text} SIEMPRE`
             }
         });
          
       }

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene (scene: string)
    {
        this.scene.start(scene);
    }
}

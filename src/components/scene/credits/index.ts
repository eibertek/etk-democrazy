import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../../game/event-bus';

const textVariant = ({size=30, color="#ffffff", stroke="#000000", strokeThickness=8}) => ({
	fontFamily: 'Arial', fontSize: size, color, stroke, strokeThickness
});

export class Credits extends Scene
{
    background?: GameObjects.Image;
    logo?: GameObjects.Image;
    title?: GameObjects.Text;
    logoTween?: Phaser.Tweens.Tween | null;
    keys?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Credits');        
    }
    
    onObjectClicked = () => {
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
       const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
       const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

       this.add.text(screenCenterX, screenCenterY - 100, 'Creditos:', textVariant({size:40, strokeThickness:8})).setOrigin(0.5).setDepth(100);
        this.title = this.add.text(screenCenterX, screenCenterY + 140, '> volver < ',  textVariant({size:40, strokeThickness:8})).setOrigin(0.5).setDepth(100);
         
         this.title.setInteractive();
         this.title.on('pointerdown',this.onObjectClicked);
         this.add.text(screenCenterX-300, screenCenterY-80,"Creador: Mariano Eiberman ", textVariant({size:20, strokeThickness:3}));
         this.add.text(screenCenterX-300, screenCenterY-60,"Imagenes hechas por IA ", textVariant({size:20, strokeThickness:3}));
         this.add.text(screenCenterX-300, screenCenterY - 40, `Sprites: bluecarrot16, Benjamin K. Smith (BenCreating), Evert, 
            Eliza Wyatt (ElizaWy), TheraHedwig, MuffinElZangano, Durrani, 
            Johannes Sj?lund (wulax), 
            Stephen Challener (Redshrike), JaidynReiman, 
            Thane Brimhall (pennomi), Johannes Sjölund (wulax), 
            Pierre Vigier (pvigier)`, textVariant({size:20, strokeThickness:3}));
          
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('MainMenu');       
    }
}

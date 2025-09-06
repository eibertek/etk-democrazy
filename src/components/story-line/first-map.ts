import { Scene } from "phaser";

export interface IStory {
    text: string;
    avatar: string;
    avatarNumber: number;
    action?: (params?: unknown)=>void;    
};

export interface IObjectives {
    allEnemyDown?: boolean;
    checkpoints?: string[];
};
export interface IStoryEvent {
    id: string;
    story: IStory[];
    repeatable: boolean;
    objectives?: {
        allEnemyDown?: boolean,
        checkpoints?: string[],
        [item:string]:unknown
    },
    onFulFill?: {
        story?: IStory[];
        action?: (param?:()=>void | unknown)=>void;
    },
    onPending?: {
        story?: IStory[];
        action?: (param?:()=>void | unknown)=>void;
    },    
    actions?: (params?: ()=>void | unknown)=>void;
}

export interface IFirstMapProps {
    events: IStoryEvent[]
    preload?: ()=> void,
};

export const firstMapStoryLine = (scene: Scene) => ({
    preload: () => {
    },
    events: [
        {
            id: 'Start',
            story: [
                {
                    text: "Bien, creo que me pondre en marcha",
                    avatar: "dialog_box",
                    avatarNumber: 10,
                    action: () => {
                        
                    },
                },
                {
                    text: "Cuidado Javo, hay varios aliens en tu camino",
                    avatar: "dialog_box",
                    avatarNumber: 0
                },
            ],
        },
        {
            id: 'dan1',
            story: [
                {
                    text: "Javo!! hemos visto a Larreta cerca, guarda",
                    avatar: "dialog_box",
                    avatarNumber: 0
                },
                {
                    text: "El siniestro! y yo sin la silla de ruedas",
                    avatar: "dialog_box",
                    avatarNumber: 11
                },
                {
                    text: "Voy a destruirlo",
                    avatar: "dialog_box",
                    avatarNumber: 12
                },
                {
                    text: "Confiamos en usted presidente",
                    avatar: "dialog_box",
                    avatarNumber: 1
                },
            ],
        },
        {
            id: 'Larreta',
            story: [
                {
                    text: "Milei, me tenes cansado con tus insultos",
                    avatar: "dialog_box",
                    avatarNumber: 20
                },
                {
                    text: "Metete las encuestas en el orto Horacio.",
                    avatar: "dialog_box",
                    avatarNumber: 12
                },
                {
                    text: "Tengo que preguntarle a la consultora ahora vuelvo",
                    avatar: "dialog_box",
                    avatarNumber: 21
                },
                {
                    text: "como le roban plata jaja",
                    avatar: "dialog_box",
                    avatarNumber: 11
                },
            ],
            actions: (actor: Phaser.GameObjects.Sprite) => {
                actor.setAlpha(1);
                actor.play('hrl-walk-down', true);
            }
        },
        {
            id: 'GotoSecondMap',
            repeatable: true,
            objectives: {
                allEnemyDown: true,
                checkpoints: ["Larreta"]
            },
            onFulFill: {
                story: [
                    {
                        text: "Javo, te felicito fue un excelente nivel",
                        avatar: "dialog_box",
                        avatarNumber: 0
                    },
                    {
                        text: "Gracias tipito, todavia queda mas",
                        avatar: "dialog_box",
                        avatarNumber: 11
                    },
                    {
                        text: "Gracias por jugar",
                        avatar: "dialog_box",
                        avatarNumber: 13,
                        action: (callback = () => { }) => {
                            if (callback) callback();
                            setTimeout(()=>{
                                scene.scene.stop('first-map');
                                scene.scene.stop('game-ui');
                                scene.scene.start('MainMenu');    
                            }, 2000);
                        }
        
                    }
                ],
            },
            onPending: {
                story: [
                    {
                        text: "Javo, Tenes que vencer a los enemigos!",
                        avatar: "dialog_box",
                        avatarNumber: 0
                    },
                    {
                        text: "Estoy en eso",
                        avatar: "dialog_box",
                        avatarNumber: 11,
                    },
                ],
                action: (callback = () => { }) => {                    
                    if (callback) callback();
                }
            },
            actions: () => {
            }
        },
        {
            id: 'easterEgg',
            repeatable: true,
            actions: (actor: Phaser.GameObjects.Sprite) => {
                actor.setAlpha(1);
                actor.play('morcilla-walk-down', true);
            },
            objectives: {
                allEnemyDown: false,
                checkpoints: ["Larreta"]
            },
            onFulFill: {
                story: [
                    {
                        text: "Mario, tu princesa esta en el otro castillo",
                        avatar: "dialog_box",
                        avatarNumber: 3
                    },
                    {
                        text: "Morcilla!, este es otro juego",
                        avatar: "dialog_box",
                        avatarNumber: 11
                    },
                    {
                        text: "Verdadero, anda al final del nivel asi terminas el juego",
                        avatar: "dialog_box",
                        avatarNumber: 3
                    },
                ],
            },
            onPending: {
                story: [
                    {
                        text: "hola Javo, Lo viste a Larreta?",
                        avatar: "dialog_box",
                        avatarNumber: 3
                    },
                    {
                        text: "Me dijo Dan, pero no lo vi",
                        avatar: "dialog_box",
                        avatarNumber: 11,
                    },
                    {
                        text: "Morcilla, no hagas perder tiempo al presidente",
                        avatar: "dialog_box",
                        avatarNumber: 0,
                    },
                    {
                        text: "Mala mia",
                        avatar: "dialog_box",
                        avatarNumber: 3,
                        action: (callback = () => { }) => {                    
                            if (callback) callback();
                            //@ts-expect-error nomilei
                            scene.milei.refillLife();
                        }
                    },                    
                ],
                action: (callback = () => { }) => {                    
                    if (callback) callback();
                }
            }
        }        
    ],
}) as unknown as IFirstMapProps;
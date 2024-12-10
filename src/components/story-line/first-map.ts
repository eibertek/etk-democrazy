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
        [item:string]:unknown
    },
    onFulFill?: {
        story?: IStory[];
        action: (param?:()=>void)=>void;
    },
    onPending?: {
        story?: IStory[];
        action: (param?:()=>void)=>void;
    },    
    actions?: (params: unknown)=>void;
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
                    action: (time: number) => {
                        return scene.add.timeline({
                            at: time,
                            run: () => {
                                scene.add.circle(10, 10, 30, 0xFFDDDD);
                            }
                        });
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
                    text: "Anulo mufa",
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
                        text: "Gracias gordo, todavia queda mas",
                        avatar: "dialog_box",
                        avatarNumber: 11
                    },
                ],
                action: (callback = () => { }) => {
                    if (callback) callback();
                    scene.scene.start('game-ui');
                }
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
                        action: (callback = () => { }) => {                    
                            if (callback) callback();
                            console.log(scene.milei);
                            scene.milei.refillLife();
                        }        
                    },
                ],
                action: (callback = () => { }) => {                    
                    if (callback) callback();
                }
            },
            actions: () => {
            }
        }
    ],
}) as unknown as IFirstMapProps;
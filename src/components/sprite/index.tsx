"use client";
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

interface ISpriteAnimatorProps {
    sprite?: string,
    width?: number,
    height?: number,
    fps?: number,
    frameCount?:number,
    startX?: number,
    startY?: number,
    startFrame?:number,
    direction?: 'horizontal' | 'vertical',
}

const SpriteAnimator = (props: ISpriteAnimatorProps) => {
    const { frameCount, sprite, width, height, fps=8, startFrame, startY } = props;
    const [actualFrame, setActualFrame] = useState(startFrame || 0);

    const move = () => {
        setActualFrame((prev)=> {            
            const nextFrame =  prev < frameCount ? prev + 1 : 0;
            return nextFrame;
        });
        setTimeout(()=> requestAnimationFrame(move), 1000 / fps );
    };

    useEffect(() => {
        const lapse = requestAnimationFrame(move);        

        return ()=> {
            cancelAnimationFrame(lapse);
        };
    }, []);

    const Sprite = styled.div`
        background-image: url("${sprite}");
        width: ${width}px;
        height: ${height}px;
        background-position: -${width*actualFrame}px -${height*startY}px;
    `;
    
   return (
    <Sprite></Sprite>
  )
}

export default SpriteAnimator;

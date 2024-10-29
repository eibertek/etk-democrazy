import React, { useEffect, useState } from 'react'
import SpriteAnimator from '../sprite';
import styled from 'styled-components';

const IDLE = "idle";
const WALK = "walk";
const ATTACK = "attack";
const JUMP = "jump";

const LEFT = "left";
const UP = "up";
const DOWN = "down";
const RIGHT = "right";

const KEY = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  SPACE: 'space'
};

const Character = (props) => {
  const [status, setStatus] = useState(IDLE);
  const [direction, setDirection] = useState(RIGHT);
  const [position, setPosition] = useState({ x: 140, y: 120 });
  const maxSpeed = 10;
  let xForce = 0;

  const getFrame = (): [number, number] => {
    if (status === WALK && direction === LEFT) {
      return [9, 8]
    }
    if (status === WALK && direction === RIGHT) {
      return [11, 8]
    }
    if (status === WALK && direction === UP) {
      return [8, 8]
    }
    if (status === WALK && direction === DOWN) {
      return [10, 8]
    }
    if (status === IDLE && direction === LEFT) {
      return [9, 1]
    }
    if (status === IDLE && direction === RIGHT) {
      return [11, 1]
    }
    if (status === IDLE && direction === UP) {
      return [8, 1]
    }
    if (status === IDLE && direction === DOWN) {
      return [10, 1]
    }
    return [11,8];
  };

  const [startY, frameCount] = getFrame();
  const styles = {
    sprite: '/assets/sprite_milei.png',
    width: 64,
    height: 64,
    fps: 8,
    frameCount,
    startFrame: 0,
    startY,
    direction: "horizontal" as 'horizontal'
  };

  useEffect(() => {
  }, []);

  const animate = (code: string) => {
    switch (code) {
      case KEY.SPACE:
        setStatus(JUMP);
        break;
      case KEY.LEFT:
        setDirection(LEFT);
        setStatus(WALK);
        break;
      case KEY.UP:
        setDirection(UP);
        setStatus(WALK);
        break;
      case KEY.DOWN:
        setDirection(DOWN);
        setStatus(WALK);
        break;
      case KEY.RIGHT:
        setDirection(RIGHT);
        setStatus(WALK);
        break;
    }
  };

  const move = (code: string) => {
    let newx = 0;
    let newy = 0;
    xForce = xForce + 0.25;
    if (xForce >= maxSpeed) {
      xForce = maxSpeed;
    };
    switch (code) {
      case KEY.SPACE:
        break;
      case KEY.LEFT:
        newx -= xForce;
        break;
      case KEY.RIGHT:
        newx += xForce;
        break;
      case KEY.UP:
        newy -= xForce;
        break;
      case KEY.DOWN:
        newy += xForce;
        break;
    }
    setPosition(prev => ({ x: prev.x + newx, y: prev.y + newy }))
  };


  const onKeyDown = (key: KeyboardEvent) => {
    move(key.code);
    animate(key.code);
  };

  const onKeyUp = () => {
    if (xForce > 0) {
      xForce= 0;
    }    
    setStatus(IDLE);
  }

  useEffect(() => {
    document.addEventListener("keydown", (evt) => onKeyDown(evt));
    document.addEventListener("keyup", (evt) => onKeyUp(evt));

    return () => {
      document.removeEventListener("keydown", (evt) => onKeyDown(evt));
      document.addEventListener("keyup", (evt) => onKeyUp(evt));
    }

  }, [status]);

  const Div = styled.div`
    position: absolute;
    translate: ${position.x}px ${position.y}px;
  `;

  return (
    <Div>
      <SpriteAnimator {...styles} />
    </Div>
  )
}

export default Character;

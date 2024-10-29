"use client";
import React, { createRef } from 'react';
import Character from '../character';
import Wall from '../object';
import { relative } from 'path';
const COLOR = {
  WHITE: '#FFFFFF',
  GRAY: '#AAAAAA',
  BLUE: '#0000FF',
  RED: '#FF0000',
  GREEN: '#00FF00',

};
const Scene = (props) => {
  const sceneRef = createRef();

  const isBouncingwith = (position) => {
    if(sceneRef.current){
      const walls = sceneRef.current.getElementsByClassName('wall');
      for (const item of walls) {
        const { x, y, width, height } = item.getBoundingClientRect();
        const isBouncingX = !(position.x < x || position.x > (x + width)); 
        console.log(`the element in x:${isBouncingX} and y:${position.y} is colliding with? (${x}, ${y}), ${width} ${height}?`);
      }      
    }
  }

  return (
    <div ref={sceneRef} style={{position:'absolute', top:'0px', left:'0px'}}>
      <Wall width={100} height={1000} x={0} y={0} bgColor={COLOR.WHITE}/>
      <Wall width={100} height={1000} x={750} y={0} bgColor={COLOR.WHITE}/>
      <Wall width={1000} height={50} x={0} y={200} bgColor={COLOR.WHITE}/>
      <Character isBouncingwith={isBouncingwith} />
      <Wall width={50} height={50} x={0} y={300} bgColor={COLOR.WHITE}/>
      <Wall width={100} height={50} x={0} y={400} bgColor={COLOR.WHITE}/>
    </div>
  )
}

export default Scene;

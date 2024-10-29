import React from 'react'
import styled from 'styled-components';

const Wall = ({width, height, bgColor, x, y}) => {
  const Obj = styled.div`
    position:absolute;
    top:0px;
    left:0px;
    width:${width}px;
    height:${height}px;
    translate:${x}px ${y}px;
    background-color: ${bgColor};
  `;

  return (
    <Obj className="wall">Wall</Obj>
  )
}

export default Wall;
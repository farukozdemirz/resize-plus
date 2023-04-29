import { ResizerProps, IStyle } from '@/types';
import React, { useState } from 'react';
import '../style.css';

const Resizer: React.FC<ResizerProps> = ({
  children,
  minWidth = 40,
  minHeight = 40
}) => {
  const [styleValue] = useState<IStyle>({
    width: minWidth,
    height: minHeight,
    left: 0,
    top: 0,
    angle: 0,
  })
  const { width, height, left, top, angle } = styleValue;
  return (
    <>
      <div style={{
        width,
        height,
        left,
        top,
        transform: `rotate(${angle}deg)`,
      }} className='resizer-container'>
        <div className='resizer-border' />
        <div className='handler-top' />
        <div className='handler-bottom' />
        <div className='handler-right' />
        <div className='handler-left' />
        <div className='handler-top-right' />
        <div className='handler-top-left' />
        <div className='handler-bottom-right' />
        <div className='handler-bottom-left' />
        <div className='handler-rotate' />
        {children}
      </div>
      <div className="rotator-angle-div" />
      <div className="resizer-target-hover-line" />
    </>
  );
};

export default Resizer;

import { ResizerProps, IStyle } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import '../style.css';

const Resizer = ({
  children,
  minWidth = 40,
  minHeight = 40,
  style,
  isLocked
}: ResizerProps) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  let targetRef = useRef<HTMLDivElement>(null);

  const [styleValue, setStyleValue] = useState<IStyle>({
    width: style.width || minWidth,
    height: style.height || minHeight,
    left: style.left || 0,
    top: style.top || 0,
    angle: style.angle || 0,
  })

  const { width, height, left, top, angle } = styleValue;

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      e.stopPropagation();
      e.type === 'mousemove' && e.preventDefault();

      let X = e.clientX + document.body.scrollLeft;
      let Y = e.clientY + document.body.scrollTop;
      let cx = style.left + style.width / 2;
      let cy = style.top + style.height / 2;
      let angle = style.angle;

      if (e.type === 'touchmove') {
        X = e.touches[0].clientX + document.body.scrollLeft;
        Y = e.touches[0].clientY + document.body.scrollTop;
      }

      if (targetRef.current?.className === 'handler-rotate') {
        angle = Math.atan2(cx - X, -(cy - Y)) * (180 / Math.PI) - 180;
        angle = angle >= 0 ? angle : 360 + angle;
        setStyleValue((prev) => ({
          ...prev,
          angle
        }))
      }
    }

    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      e.type === 'mouseup' && e.preventDefault();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }

    const handleMouseDown = (e: any) => {
      e.stopPropagation();
      targetRef = { current: e.target };

      if (!isLocked) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
      }
    };

    resizerRef.current?.addEventListener('mousedown', handleMouseDown);
    resizerRef.current?.addEventListener('touchstart', handleMouseDown);
    return () => {
      resizerRef.current?.removeEventListener('mousedown', handleMouseDown);
      resizerRef.current?.removeEventListener('touchstart', handleMouseDown);
    };
  }, []);


  return (
    <>
      <div style={{
        width,
        height,
        left,
        top,
        transform: `rotate(${angle}deg)`,
      }}
        className='resizer-container'
        ref={resizerRef}>
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
    </>
  );
};

export default Resizer;

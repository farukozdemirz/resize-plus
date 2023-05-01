import { ResizerProps, IStyle, IAction, ActionType } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import '../style.css';

const Resizer = ({
  minWidth = 40,
  minHeight = 40,
  style,
  isLocked,
  onRotateStart = () => { },
  onRotate = () => { },
  onRotateEnd = () => { }
}: ResizerProps) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  let targetRef = useRef<HTMLDivElement>(null);

  const [styleValue, setStyleValue] = useState<IStyle>({
    width: style.width || minWidth,
    height: style.height || minHeight,
    left: style.left || 0,
    top: style.top || 0,
    angle: style.angle || 0,
    transformOrigin: style.transformOrigin || 'center',
  })

  const { width, height, left, top, angle, transformOrigin } = styleValue;

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('touchend', handleMouseUp);
    setStyleValue((prevStyle) => {
      handleAction({
        type: `${targetRef.current?.dataset.id}-end` as ActionType,
        event: e,
        style: prevStyle,
      });
      return prevStyle;
    });
  }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.type === 'mousemove' && e.preventDefault();

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];
    let centerX = left + width / 2;
    let centerY = top + height / 2;
    let newAngle = angle;

    if (targetRef.current?.dataset.id === 'rotate') {
      newAngle = Math.atan2(centerX - clientX, -(centerY - clientY)) * (180 / Math.PI) - 180;
      newAngle = newAngle >= 0 ? newAngle : 360 + newAngle;
      setStyleValue((prev) => ({
        ...prev,
        angle: newAngle,
        transformOrigin: 'center',
      }))
      handleAction({
        type: "rotate",
        event: e,
        style: {
          ...styleValue,
          angle: newAngle,
          transformOrigin: 'center',
        },
      });
    }
  }

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if (e.target instanceof HTMLDivElement) {
      targetRef = { current: e.target }
    }

    if (!isLocked) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    setStyleValue((prevStyle) => {
      handleAction({
        type: `${targetRef.current?.dataset.id}-start` as ActionType,
        event: e,
        style: prevStyle,
      });
      return prevStyle;
    });
  };

  useEffect(() => {
    resizerRef.current?.addEventListener('mousedown', handleMouseDown);
    resizerRef.current?.addEventListener('touchstart', handleMouseDown);
    return () => {
      resizerRef.current?.removeEventListener('mousedown', handleMouseDown);
      resizerRef.current?.removeEventListener('touchstart', handleMouseDown);
    };
  }, []);


  const handleAction = (action: IAction) => {
    switch (action.type) {
      case "rotate-start":
        let styles = action.style || styleValue;
        styles.transformOrigin = 'center';
        onRotateStart(action.event, styles)
        break;
      case "rotate":
        onRotate(action.event, action.style || styleValue)
        break;
      case "rotate-end":
        styles = action.style || styleValue;
        styles.transformOrigin = `${width / 2}px ${height / 2}px`;
        onRotateEnd(action.event, styles);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div style={{
        width,
        height,
        left,
        top,
        transform: `rotate(${angle}deg)`,
        transformOrigin,
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
        <div
          className='handler-bottom-right'
        />
        <div
          className='handler-bottom-left'
        />
        <div
          className='handler-rotate'
          data-id="rotate"
        />
      </div>
    </>
  );
};

export default Resizer;

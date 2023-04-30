import { ResizerProps, IStyle, IAction, ActionType, Direction } from '@/types';
import React, { useEffect, useRef } from 'react';
import '../style.css';

const Resizer = ({
  minWidth = 40,
  minHeight = 40,
  style,
  isLocked,
  onRotateStart = () => { },
  onRotate = () => { },
  onRotateEnd = () => { },
  onResize = () => { },
  lockAspectRatio = false,
}: ResizerProps) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  let targetRef = useRef<HTMLDivElement>(null);
  const resizerStartPosition = useRef({ x: 0, y: 0 });
  const styleValueRef = useRef<IStyle>({
    width: style.width || minWidth,
    height: style.height || minHeight,
    left: style.left || 0,
    top: style.top || 0,
    angle: style.angle || 0,
  })

  const { width, height, left, top, angle } = styleValueRef.current;

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('touchend', handleMouseUp);
    handleAction({
      type: `${targetRef.current?.dataset.id}-end` as ActionType,
      event: e,
    });
  }

  const handleRotate = (e: MouseEvent | TouchEvent, centerX: number, clientX: number, centerY: number, clientY: number) => {
    let newAngle = Math.atan2(centerX - clientX, -(centerY - clientY)) * (180 / Math.PI) - 180;
    newAngle = newAngle >= 0 ? newAngle : 360 + newAngle;
    styleValueRef.current = {
      ...styleValueRef.current,
      angle: newAngle
    }
    handleAction({
      type: "rotate",
      event: e
    });
  }

  const handleResize = (
    e: MouseEvent | TouchEvent,
    x: number,
    y: number,
    direction: Direction
  ) => {
    let newWidth = width;
    let newHeight = height;
    let newTop = top;
    let newLeft = left;

    const setStyleValue = (newStyleValue: Partial<IStyle>) => {
      styleValueRef.current = { ...styleValueRef.current, ...newStyleValue };
      handleAction({ type: 'resize', event: e });
    };

    switch (direction) {
      case 'right':
        newWidth = width + x;
        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
        break;
      case 'left':
        newLeft = left + x;
        newWidth = width - x;
        if (newWidth < minWidth) {
          newLeft = left + width - minWidth;
          newWidth = minWidth;
        }
        break;
      case 'top':
        newTop = top + y;
        newHeight = height - y;
        if (newHeight < minHeight) {
          newTop = top + height - minHeight;
          newHeight = minHeight;
        }
        break;
      case 'bottom':
        newHeight = height + y;
        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
        break;
      case 'top-right':
        newTop = top + y;
        newHeight = height - y;
        newWidth = width + x;
        if (newHeight < minHeight) {
          newTop = top + height - minHeight;
          newHeight = minHeight;
        }
        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
        if (lockAspectRatio) {
          newWidth = newHeight * width / height;
        }
        break;
      case 'top-left':
        newWidth = width - x
        newHeight = height - y
        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
        if (lockAspectRatio) {
          let hr = height / width;
          newHeight = newWidth * hr;
        }
        newTop = top + height - newHeight;
        newLeft = left + width - newWidth;

        break;
      case 'bottom-right':
        newWidth = width + x;
        newHeight = height + y;
        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
        if (lockAspectRatio) {
          let hr = height / width;
          newHeight = newWidth * hr;
        }
        break;
      case 'bottom-left':
        newWidth = width - x;
        newHeight = height + y;
        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
        if (lockAspectRatio) {
          let hr = height / width;
          newHeight = width * hr;
        }
        newLeft = left + width - newWidth;
        break;
      default:
        break;
    }

    setStyleValue({
      width: newWidth,
      height: newHeight,
      top: newTop,
      left: newLeft,
    });
  }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.type === 'mousemove' && e.preventDefault();

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];
    let centerX = left + width / 2;
    let centerY = top + height / 2;
    let x = clientX - resizerStartPosition.current.x;
    let y = clientY - resizerStartPosition.current.y;

    if (targetRef.current?.dataset.id === 'rotate') {
      handleRotate(e, centerX, clientX, centerY, clientY);
    } else {
      handleResize(e, x, y, targetRef.current?.dataset.id as Direction)
    }
  };


  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.type === 'mousedown' && e.preventDefault();
    e.stopPropagation();

    if (e.target instanceof HTMLDivElement) {
      targetRef = { current: e.target }
    }

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];

    resizerStartPosition.current = {
      x: clientX,
      y: clientY,
    };

    if (!isLocked) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    handleAction({
      type: `${targetRef.current?.dataset.id}-start` as ActionType,
      event: e,
    });
  };

  useEffect(() => {
    resizerRef.current?.addEventListener('mousedown', handleMouseDown);
    resizerRef.current?.addEventListener('touchstart', handleMouseDown);
    return () => {
      resizerRef.current?.removeEventListener('mousedown', handleMouseDown);
      resizerRef.current?.removeEventListener('touchstart', handleMouseDown);
    };
  }, [styleValueRef.current]);


  const handleAction = (action: IAction) => {
    switch (action.type) {
      case "rotate-start":
        onRotateStart(action.event)
        break;
      case "rotate":
        onRotate(action.event, styleValueRef.current)
        break;
      case "rotate-end":
        onRotateEnd(action.event, styleValueRef.current);
        break;
      case "resize":
        onResize(action.event, styleValueRef.current)
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
      }}
        className='resizer-container'
        ref={resizerRef}>
        <div
          className='resizer-border'
          data-id="border"
        />
        <div
          className='handler-top'
          data-id="top"
        />
        <div
          className='handler-bottom'
          data-id="bottom"
        />
        <div
          className='handler-right'
          data-id="right"
        />
        <div
          className='handler-left'
          data-id="left"
        />
        <div
          className='handler-top-right'
          data-id="top-right"
        />
        <div
          className='handler-top-left'
          data-id="top-left"
        />
        <div
          className='handler-bottom-right'
          data-id="bottom-right"
        />
        <div
          className='handler-bottom-left'
          data-id="bottom-left"
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

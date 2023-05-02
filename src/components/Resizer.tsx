import { ResizerProps, IStyle, IAction, ActionType, Direction, TransformOrigin, ICoordinates } from '@/types';
import React, { useEffect, useRef } from 'react';
import '../style.css';
import { rotateXY, getCoordinates, handleDomStyle, adjustRotate, calculateResizeByDirection, calculateResizeByDirectionWithAngle } from '../utils/functions';

const Resizer = ({
  minWidth = 40,
  minHeight = 40,
  style,
  isLocked,
  onRotateStart = () => { },
  onRotate = () => { },
  onRotateEnd = () => { },
  onResize = () => { },
  onResizeStart = () => { },
  onResizeEnd = () => { },
  lockAspectRatio = false,
  resizeFromCenter = false,
  targetRef
}: ResizerProps) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  let actionRef = useRef<HTMLDivElement>(null);
  const resizerStartPosition = useRef({ x: 0, y: 0 });
  const styleValueRef = useRef<IStyle>({
    width: style.width || minWidth,
    height: style.height || minHeight,
    left: style.left || 0,
    top: style.top || 0,
    angle: style.angle || 0,
  })
  const coordinatesValueRef = useRef<ICoordinates>({
    rotatedTopLeftX: 0,
    rotatedTopLeftY: 0,
    rotatedTopRightX: 0,
    rotatedTopRightY: 0,
    rotatedBottomRightX: 0,
    rotatedBottomRightY: 0,
    rotatedBottomLeftX: 0,
    rotatedBottomLeftY: 0,
    centerX: 0,
    centerY: 0,
  })

  const { width, height, left, top, angle } = styleValueRef.current;

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('touchend', handleMouseUp);

    if (angle > 0 && actionRef.current?.dataset.id !== 'rotate' && !resizeFromCenter) {

      handleDomStyle(targetRef, resizerRef, {
        ...styleValueRef.current,
        transformOrigin: '',
      });
      let newSize = JSON.parse(JSON.stringify(styleValueRef.current)); //deep clone
      let rotateAdjust;
      let transformOrigin;
      const oldSize = { width, height, left, top, angle };

      switch (actionRef.current?.dataset.id) {
        case 'bottom-right':
        case 'bottom':
        case 'right':
          transformOrigin = 'TopLeft' as TransformOrigin;
          break;
        case 'bottom-left':
        case 'left':
          transformOrigin = 'TopRight' as TransformOrigin;
          break;
        case 'top-left':
        case 'top':
          transformOrigin = 'BottomRight' as TransformOrigin;
          break;
        case 'top-right':
          transformOrigin = 'BottomLeft' as TransformOrigin;
          break;

        default:
          transformOrigin = '' as TransformOrigin;
          break;
      }
      rotateAdjust = adjustRotate(newSize, oldSize, transformOrigin);
      styleValueRef.current = {
        ...styleValueRef.current,
        left: rotateAdjust.x,
        top: rotateAdjust.y
      }
    }
    if (actionRef.current?.dataset.id === 'rotate') {
      handleAction({
        type: `rotate-end` as ActionType,
        event: e,
      });
    } else {
      handleAction({
        type: `resize` as ActionType,
        event: e,
      });
      handleAction({
        type: `resize-end` as ActionType,
        event: e,
      });
    }
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
    clientX: number,
    clientY: number,
    direction: Direction
  ) => {
    const coodinates = coordinatesValueRef.current;

    const setStyleValue = (newStyleValue: Partial<IStyle>) => {
      styleValueRef.current = { ...styleValueRef.current, ...newStyleValue };
      handleAction({ type: 'resize', event: e });
    };

    if (angle && targetRef.current) {
      const {
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        height: targetHeight
      } = targetRef.current.getBoundingClientRect();

      let centerX = targetLeft + targetWidth / 2;
      let centerY = targetTop + targetHeight / 2;

      const rotateDirection = rotateXY(centerX, centerY, clientX, clientY, angle);
      x = rotateDirection.x - resizerStartPosition.current.x;
      y = rotateDirection.y - resizerStartPosition.current.y;
    }

    if (resizeFromCenter) {
      x = x * 2;
      y = y * 2;
    }

    let newSizes = calculateResizeByDirection(direction, { width, height, left, top }, { minWidth, minHeight }, { x, y }, lockAspectRatio);

    if (angle > 0 && direction !== 'rotate' && !resizeFromCenter) {
      const sizesWithAngle = calculateResizeByDirectionWithAngle(newSizes, direction, coodinates);
      newSizes = { ...sizesWithAngle };
    }

    if (resizeFromCenter) {
      newSizes.left = coodinates.centerX - newSizes.width / 2;
      newSizes.top = coodinates.centerY - newSizes.height / 2;
    }

    setStyleValue({
      width: newSizes.width,
      height: newSizes.height,
      top: newSizes.top,
      left: newSizes.left,
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

    if (actionRef.current?.dataset.id === 'rotate') {
      handleRotate(e, centerX, clientX, centerY, clientY);
    } else {
      handleResize(e, x, y, clientX, clientY, actionRef.current?.dataset.id as Direction)
    }
  };

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.type === 'mousedown' && e.preventDefault();
    e.stopPropagation();

    if (e.target instanceof HTMLDivElement) {
      actionRef = { current: e.target }
    }

    if (!isLocked) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];

    resizerStartPosition.current = {
      x: clientX,
      y: clientY,
    };

    if (angle > 0) {
      if (resizerRef.current) {
        const client = resizerRef.current.getBoundingClientRect();
        let centerX = client.left + client.width / 2;
        let centerY = client.top + client.height / 2;
        const startPos = rotateXY(centerX, centerY, resizerStartPosition.current.x, resizerStartPosition.current.y, angle)

        resizerStartPosition.current = {
          x: startPos.x,
          y: startPos.y,
        };
      }
    }

    if (angle > 0 && !resizeFromCenter) {
      let coord = getCoordinates(styleValueRef.current, angle);
      coordinatesValueRef.current = coord;
      let newStyleValue = JSON.parse(JSON.stringify(styleValueRef.current));
      switch (actionRef.current?.dataset.id) {
        case "bottom-right":
        case "right":
        case "bottom":
          handleDomStyle(targetRef, resizerRef, {
            ...newStyleValue,
            transformOrigin: 'top left',
            left: coord.rotatedTopLeftX,
            top: coord.rotatedTopLeftY,
          });
          break;
        case "bottom-left":
        case "left":
          handleDomStyle(targetRef, resizerRef, {
            ...newStyleValue,
            transformOrigin: 'top right',
            top: coord.rotatedTopRightY,
            left: coord.rotatedTopRightX - width
          });
          break;
        case "top-right":
          handleDomStyle(targetRef, resizerRef, {
            ...newStyleValue,
            transformOrigin: 'bottom left',
            left: coord.rotatedBottomLeftX,
            top: coord.rotatedBottomLeftY - height // veya height,
          });
          break;
        case "top-left":
        case "top":
          handleDomStyle(targetRef, resizerRef, {
            ...newStyleValue,
            transformOrigin: 'bottom right',
            left: coord.rotatedBottomRightX - width, // veya width,
            top: coord.rotatedBottomRightY - height, // veya height
          })
          break;
        default:
          break;
      }
    }
    if (actionRef.current?.dataset.id === 'rotate') {
      handleAction({
        type: `rotate-start` as ActionType,
        event: e,
      });
    } else {
      handleAction({
        type: `resize-start` as ActionType,
        event: e,
      });
    }
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
        onRotateStart(action.event, styleValueRef.current)
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
      case "resize-start":
        onResizeStart(action.event, styleValueRef.current)
        break;
      case "resize-end":
        onResizeEnd(action.event, styleValueRef.current)
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

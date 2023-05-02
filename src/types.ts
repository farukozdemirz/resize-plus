export interface Enable {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  topRight?: boolean;
  bottomRight?: boolean;
  bottomLeft?: boolean;
  topLeft?: boolean;
}
export interface IStyle {
  width: number;
  height: number;
  left: number;
  top: number;
  angle: number;
  transformOrigin?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'center' | '';
}
export interface ResizerProps {
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: string;
  resizeFromCenter?: boolean;
  lockAspectRatio?: boolean;
  onResizeStart?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onResizeEnd?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onRotateStart?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onResize?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onRotateEnd?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onRotate?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  isHideOnResize?: boolean;
  onResizerHide?: () => void;
  onResizerShown?: () => void;
  enable?: Enable;
  style: IStyle;
  zoom?: number;
  isLocked?: boolean;
  targetRef: React.RefObject<HTMLDivElement>;
}

export type ActionType = "rotate-start" | "rotate" | "rotate-end" | "resize-start" | "resize" | "resize-end";
export interface IAction {
  type: ActionType;
  event: MouseEvent | TouchEvent;
}
export type Direction = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | "bottom-right" | "bottom-left" | 'rotate';
export type TransformOrigin = 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft';

export interface ICoordinates {
  rotatedTopLeftX: number;
  rotatedTopLeftY: number;
  rotatedTopRightX: number;
  rotatedTopRightY: number;
  rotatedBottomRightX: number;
  rotatedBottomRightY: number;
  rotatedBottomLeftX: number;
  rotatedBottomLeftY: number;
  centerX: number;
  centerY: number;
}
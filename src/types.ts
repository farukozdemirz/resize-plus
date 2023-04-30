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
  transformOrigin: string;
}
export interface ResizerProps {
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: string;
  resizeFromCenter?: boolean;
  lockAspectRatio?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onResize?: () => void;
  onRotateStart?: (e: MouseEvent | TouchEvent) => void;
  onRotateEnd?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  onRotate?: (e: MouseEvent | TouchEvent, style: IStyle) => void;
  isHideOnResize?: boolean;
  onResizerHide?: () => void;
  onResizerShown?: () => void;
  enable?: Enable;
  style: IStyle;
  zoom?: number;
  isLocked?: boolean;
}

export type ActionType = "rotate-start" | "rotate" | "rotate-end";
export interface IAction {
  type: ActionType;
  event: MouseEvent | TouchEvent;
  style?: IStyle;
}

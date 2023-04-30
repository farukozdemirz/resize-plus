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
}
export interface ResizerProps {
  minWidth?: number;
  minHeight?: number;
  aspectRatio: string;
  resizeFromCenter: boolean;
  lockAspectRatio: boolean;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onResize: () => void;
  onRotateStart: (e: any) => void;
  onRotateEnd: () => void;
  onRotate: () => void;
  isHideOnResize: boolean;
  onResizerHide: () => void;
  onResizerShown: () => void;
  enable: Enable;
  style: IStyle;
  children: React.ReactNode;
  zoom: number;
  isLocked?: boolean;
}
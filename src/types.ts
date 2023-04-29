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
  width: string | number;
  height: string | number;
  left?: string | number;
  top?: string | number;
  angle?: string | number;
}
export interface ResizerProps {
  minWidth?: number;
  minHeight?: number;
  aspect: string;
  resizeFromCenter: boolean;
  lockAspectRatio: boolean;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onResize: () => void;
  onRotateStart: () => void;
  onRotateEnd: () => void;
  onRotate: () => void;
  isHideOnResize: boolean;
  onResizerHide: () => void;
  onResizerShown: () => void;
  enable: Enable;
  style?: IStyle;
  children: React.ReactNode;
  zoom: number;
}
// resizers: {
//   n: true,                // top middle resize handler            true:visible|false:hidden
//   s: true,                // bottom middle resize handler
//   e: true,                // right middle resize handler
//   w: true,                // left middle resize handler
//   ne: true,               // top-right resize handler
//   nw: true,               // top-left resize handler
//   se: true,               // bottom-right resize handler
//   sw: true,               // bottom-left resize handler
//   r: true,                // rotate handler
// },
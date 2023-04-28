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

export interface ResizerProps {
  minWidth: number;
  minHeight: number;
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
}
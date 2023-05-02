import { Direction, ICoordinates, IStyle, TransformOrigin } from "@/types";

export const rotateXY = (centerX: number, centerY: number, startX: number, startY: number, angle: number) => {
  let radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    newX = cos * (startX - centerX) + sin * (startY - centerY) + centerX,
    newY = cos * (startY - centerY) - sin * (startX - centerX) + centerY;
  return { x: newX, y: newY };
}

export const getCoordinates = (size: IStyle, angle: number) => {
  // Açıyı radyana çevirir
  const angleRadians = (Math.PI / -180) * angle;
  // Cosinus ve Sinüs değerlerini hesaplar
  const cosAngle = Math.cos(angleRadians);
  const sinAngle = Math.sin(angleRadians);

  // Kare'nin köşe noktalarının koordinatlarını hesaplar
  const topLeftX = size.left;
  const topLeftY = size.top;
  const topRightX = topLeftX + size.width;
  const topRightY = topLeftY;
  const bottomRightX = topLeftX + size.width;
  const bottomRightY = topLeftY + size.height;
  const bottomLeftX = topLeftX;
  const bottomLeftY = topLeftY + size.height;

  // Kare'nin merkez noktasını hesaplar
  const centerX = topLeftX + size.width / 2;
  const centerY = topLeftY + size.height / 2;

  // Kare'nin köşe noktalarının döndürülmüş koordinatlarını hesaplar
  let rotatedTopLeftX = Math.trunc(cosAngle * (topLeftX - centerX) + sinAngle * (topLeftY - centerY) + centerX);
  let rotatedTopLeftY = Math.trunc(cosAngle * (topLeftY - centerY) - sinAngle * (topLeftX - centerX) + centerY);

  let rotatedTopRightX = Math.trunc(cosAngle * (topRightX - centerX) + sinAngle * (topRightY - centerY) + centerX);
  let rotatedTopRightY = Math.trunc(cosAngle * (topRightY - centerY) - sinAngle * (topRightX - centerX) + centerY);

  let rotatedBottomRightX = Math.trunc(cosAngle * (bottomRightX - centerX) + sinAngle * (bottomRightY - centerY) + centerX);
  let rotatedBottomRightY = Math.trunc(cosAngle * (bottomRightY - centerY) - sinAngle * (bottomRightX - centerX) + centerY);

  let rotatedBottomLeftX = Math.trunc(cosAngle * (bottomLeftX - centerX) + sinAngle * (bottomLeftY - centerY) + centerX);
  let rotatedBottomLeftY = Math.trunc(cosAngle * (bottomLeftY - centerY) - sinAngle * (bottomLeftX - centerX) + centerY);

  return {
    rotatedTopLeftX,
    rotatedTopLeftY,
    rotatedTopRightX,
    rotatedTopRightY,
    rotatedBottomRightX,
    rotatedBottomRightY,
    rotatedBottomLeftX,
    rotatedBottomLeftY,
    centerX,
    centerY
  };
};


export const handleDomStyle = (
  targetElement: React.RefObject<HTMLDivElement>,
  resizerElement: React.RefObject<HTMLDivElement>,
  styleValue: IStyle
) => {
  const { left, top, transformOrigin } = styleValue;
  const { current: target } = targetElement;
  const { current: resizer } = resizerElement;

  if (target && resizer) {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    target.style.transformOrigin = `${transformOrigin}`;
    resizer.style.left = `${left}px`;
    resizer.style.top = `${top}px`;
    resizer.style.transformOrigin = `${transformOrigin}`;
  }
}

export const adjustRotate = (newSize: IStyle, oldSize: IStyle, transformOrigin: TransformOrigin) => {
  let s1 = getCoordinates(oldSize, newSize.angle);
  let s2 = getCoordinates(newSize, newSize.angle);

  let newX = 0;
  let newY = 0;

  switch (transformOrigin) {
    case 'TopLeft':
      newX = newSize.left + s1.rotatedTopLeftX - s2.rotatedTopLeftX;
      newY = newSize.top + s1.rotatedTopLeftY - s2.rotatedTopLeftY;
      break;
    case 'TopRight':
      newX = newSize.left + s1.rotatedTopRightX - s2.rotatedTopRightX;
      newY = newSize.top + s1.rotatedTopRightY - s2.rotatedTopRightY;
      break;
    case 'BottomRight':
      newX = newSize.left + s1.rotatedBottomRightX - s2.rotatedBottomRightX;
      newY = newSize.top + s1.rotatedBottomRightY - s2.rotatedBottomRightY;
      break;
    case 'BottomLeft':
      newX = newSize.left + s1.rotatedBottomLeftX - s2.rotatedBottomLeftX;
      newY = newSize.top + s1.rotatedBottomLeftY - s2.rotatedBottomLeftY;
      break;
    default:
      newX = newSize.left + s1.rotatedTopLeftX - s2.rotatedTopLeftX;
      newY = newSize.top + s1.rotatedTopLeftY - s2.rotatedTopLeftY;
      break;
  }

  return {
    x: newX,
    y: newY,
  };
}
interface IBoxSizePosition {
  width: number;
  height: number;
  top: number;
  left: number;
}
interface IMinimumSize {
  minWidth: number;
  minHeight: number;
}

export const calculateResizeByDirection = (direction: Direction, { width, height, top, left }: IBoxSizePosition, { minWidth, minHeight }: IMinimumSize, { x, y }: { x: number, y: number }, lockAspectRatio: boolean
): IBoxSizePosition => {
  let newWidth = width;
  let newHeight = height;
  let newTop = top;
  let newLeft = left;

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

  return {
    width: newWidth,
    height: newHeight,
    top: newTop,
    left: newLeft
  }
}
export const calculateResizeByDirectionWithAngle = (sizes: IBoxSizePosition, direction: Direction, coordinates: ICoordinates): IBoxSizePosition => {
  let { width, height, top, left } = sizes;
  switch (direction) {
    case 'bottom-right':
    case 'bottom':
    case 'right':
      left = coordinates.rotatedTopLeftX;
      top = coordinates.rotatedTopLeftY;
      break;
    case 'bottom-left':
    case 'left':
      left = coordinates.rotatedTopRightX - width;
      top = coordinates.rotatedTopRightY;
      break;
    case 'top-left':
    case 'top':
      left = coordinates.rotatedBottomRightX - width;
      top = coordinates.rotatedBottomRightY - height;
      break;
    case 'top-right':
      left = coordinates.rotatedBottomLeftX;
      top = coordinates.rotatedBottomLeftY - height;
      break;
    default:
      break;
  }

  return {
    left,
    top,
    width,
    height
  }
}
import { IStyle } from "@/types";

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

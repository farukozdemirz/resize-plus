import Resizer from '../components/Resizer';
import React, { useState } from 'react'

const ResizerWrapper = () => {
  const [style, setStyle] = useState({
    width: 200,
    height: 200,
    left: 300,
    top: 200,
    angle: 0,
  })
  const { width, height, left, top, angle } = style
  return (
    <>
      <Resizer
        style={style}
        onRotateStart={(e) => { }}
        onRotateEnd={(e) => { }}
        onRotate={(e, newStyle) => {
          setStyle(newStyle)
        }}
        onResize={(e, newStyle) => {
          setStyle(newStyle)
        }}
        isLocked={false}
      />
      <div
        style={{
          position: 'absolute',
          width,
          height,
          left,
          top,
          transform: `rotate(${angle}deg)`,
          background: '#000',
        }}
      >
        <p style={{ color: "#fff", margin: 0 }}>TEST</p>
      </div>
    </>
  )
}

export default ResizerWrapper
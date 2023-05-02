import Resizer from '../components/Resizer';
import React, { useRef, useState } from 'react'

const ResizerWrapper = () => {
  const [style, setStyle] = useState({
    width: 300,
    height: 300,
    left: 300,
    top: 300,
    angle: 0,
  })
  const { width, height, left, top, angle } = style
  const targetRef = useRef(null);
  return (
    <>
      <Resizer
        targetRef={targetRef}
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
        ref={targetRef}
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
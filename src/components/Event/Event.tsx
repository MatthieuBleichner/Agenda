import React from 'react';

interface EventProps {
  width: number;
  height: number;
  top: number;
  left: number;
}
function Event(props: EventProps) {
  const { width, height, top, left } = props;
  return (
    <div
      style={{
        width: width,
        height: height,
        backgroundColor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderLeft: '4px solid #1D4FD7',
        position: 'absolute',
        top: top,
        left: left,
      }}
    >
      <div
        style={{
          color: '#1D4FD7',
          fontWeight: 'bold',
          marginLeft: 10,
          marginTop: 10,
        }}
      >
        Sample Item
      </div>
      <div style={{ marginLeft: 10, color: 'grey' }}>Sample Location</div>
    </div>
  );
}

export default Event;

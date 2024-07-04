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
        boxSizing: 'border-box',
        position: 'absolute',
        top: top,
        left: left,
        display: 'flex',
        flexDirection: height > 20 ? 'column' : 'row', // change orientation according to height
      }}
    >
      {height >= 20 ? (
        <>
          <div
            style={{
              color: '#1D4FD7',
              fontWeight: 'bold',
              marginLeft: 10,
              marginTop: height > 20 ? 10 : 0,
            }}
          >
            Sample Item
          </div>
          <div style={{ marginLeft: 10, color: 'grey' }}>Sample Location</div>
        </>
      ) : null}
    </div>
  );
}

export default Event;

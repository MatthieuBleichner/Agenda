import React from 'react';
import './App.css';
import { Timeline } from 'components';
import config from 'config';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        flex: 1,
      }}
    >
      <div
        style={{
          width: 700,
          height: config.hoursInPixels * config.displayedHours,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Timeline />
        <div
          style={{
            width: 620,
            height: config.hoursInPixels * config.displayedHours,
            backgroundColor: '#e0e0e0',
          }}
        />
      </div>
    </div>
  );
}

export default App;

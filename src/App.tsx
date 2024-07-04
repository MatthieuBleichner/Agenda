import React from 'react';
import './App.css';
import { Timeline, Event } from 'components';
import config from 'config';
import { CalendarEvent } from 'types';
import { buildEventsOverlappingArray } from 'utils/events';

const defaultEvents: CalendarEvent[] = [
  { start: 30, end: 150 },
  { start: 540, end: 600 },
  { start: 560, end: 620 },
  { start: 610, end: 670 },
];
function App() {
  const events = defaultEvents;
  const formatedEvents = events.map((currentEvent, currentIndex) => {
    return {
      start: currentEvent.start > 0 ? currentEvent.start : 0,
      end:
        currentEvent.end < config.displayedHours * 60
          ? currentEvent.end
          : config.displayedHours * 60,
      overlappedItems: events.filter(
        (event, index) =>
          currentEvent.start <= event.end &&
          currentEvent.end >= event.start &&
          index !== currentIndex,
      ).length,
    };
  });

  console.log('formatedEvents', formatedEvents);

  const allEventsByColumns = buildEventsOverlappingArray(formatedEvents);

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
            borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {allEventsByColumns.map((event) => (
            <Event
              key={event.id}
              width={event.width}
              height={((event.end - event.start) / 60) * config.hoursInPixels}
              top={(event.start / 60) * config.hoursInPixels}
              left={10 + event.column * event.width}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

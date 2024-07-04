import { CalendarEvent } from 'types';
import config from 'config';

interface myCalendarEvent {
  id: string;
  start: number;
  end: number;
}
interface FormatedCalendarEvent {
  id: string;
  start: number;
  end: number;
  width: number;
  column: number;
}

const MAX_WIDTH = 600;

const splitOverlappingEventsInColumns: (
  arg0: myCalendarEvent[],
  arg1?: FormatedCalendarEvent[],
  arg2?: number,
) => FormatedCalendarEvent[] = (
  events,
  formatedEvents = [],
  columnIndex = 0,
) => {
  if (events.length === 0) {
    return formatedEvents;
  }

  const currentEvent = events[0];
  const otherColumnEvents: myCalendarEvent[] = [];
  const sameColumnEvents: FormatedCalendarEvent[] = [
    {
      ...currentEvent,
      column: columnIndex,
      width: MAX_WIDTH / 2, // to be change if we can have 3 columns
    },
  ];

  for (let j = 0; j < events.length; j++) {
    if (
      currentEvent.start < events[j].end &&
      currentEvent.end > events[j].start &&
      currentEvent.id !== events[j].id
    ) {
      // event overlaps, move it to another column
      otherColumnEvents.push(events[j]);
    } else if (currentEvent.id !== events[j].id) {
      let overlaps = false;
      for (let k = 0; k < sameColumnEvents.length; k++) {
        if (
          events[j].start < sameColumnEvents[k].end &&
          events[j].end > sameColumnEvents[k].start &&
          events[j].id !== sameColumnEvents[k].id
        ) {
          overlaps = true;
        }
      }
      if (!overlaps) {
        sameColumnEvents.push({
          ...events[j],
          column: columnIndex,
          width: MAX_WIDTH / 2,
        });
      } else {
        // event overlaps, move it to another column
        otherColumnEvents.push(events[j]);
      }
    }
  }

  if (otherColumnEvents.length === 0) {
    return formatedEvents.concat(sameColumnEvents);
  } else {
    return splitOverlappingEventsInColumns(
      otherColumnEvents,
      formatedEvents.concat(sameColumnEvents),
      columnIndex + 1,
    );
  }
};

export const splitEventsInColumns: (
  arg0: CalendarEvent[],
  arg1?: number,
) => FormatedCalendarEvent[] = (events) => {
  // Format events to ensure start and end values are relevant and add an id
  const myEvents: myCalendarEvent[] = events.map((event, index) => ({
    id: `${index}`,
    start: event.start > 0 ? event.start : 0,
    end:
      event.end < config.displayedHours * 60
        ? event.end
        : config.displayedHours * 60,
  }));

  // First - Build list of events that does not overlap whith any other event
  // they will be displayed in full width

  const notOverlappingEvents: FormatedCalendarEvent[] = [];
  const overlappingEvents: myCalendarEvent[] = [];
  for (let i = 0; i < myEvents.length; i++) {
    let overlaps = false;
    for (let j = 0; j < myEvents.length; j++) {
      if (
        myEvents[i].start < myEvents[j].end &&
        myEvents[i].end > myEvents[j].start &&
        myEvents[i].id !== myEvents[j].id
      ) {
        overlaps = true;
      }
    }
    for (let k = 0; k < notOverlappingEvents.length; k++) {
      if (
        myEvents[i].start < notOverlappingEvents[k].end &&
        myEvents[i].end > notOverlappingEvents[k].start &&
        myEvents[i].id !== notOverlappingEvents[k].id
      ) {
        overlaps = true;
      }
    }
    if (!overlaps) {
      notOverlappingEvents.push({
        ...myEvents[i],
        column: 0,
        width: MAX_WIDTH,
      });
    } else {
      overlappingEvents.push(myEvents[i]);
    }
  }

  // SECOND - for all overlapping events display them in several columns
  return splitOverlappingEventsInColumns(
    overlappingEvents,
    notOverlappingEvents,
  );
};

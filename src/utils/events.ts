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
  const overlappingEvents: myCalendarEvent[] = [];
  const notOverlappingEvents: FormatedCalendarEvent[] = [
    {
      ...currentEvent,
      column: columnIndex,
      width: MAX_WIDTH / 2, // to be change if we can have 3 columns
    },
  ];

  for (let i = 0; i < events.length; i++) {
    if (
      currentEvent.start <= events[i].end &&
      currentEvent.end >= events[i].start &&
      currentEvent.id !== events[i].id
    ) {
      //overlaps = true;
      overlappingEvents.push(events[i]);
    } else if (currentEvent.id !== events[i].id) {
      notOverlappingEvents.push({
        ...events[i],
        column: columnIndex,
        width: MAX_WIDTH / 2, // to be change if we can have 3 columns
      });
    }
  }

  if (overlappingEvents.length === 0) {
    return formatedEvents.concat(notOverlappingEvents);
  } else {
    return splitOverlappingEventsInColumns(
      overlappingEvents,
      formatedEvents.concat(notOverlappingEvents),
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
        myEvents[i].start <= myEvents[j].end &&
        myEvents[i].end >= myEvents[j].start &&
        myEvents[i].id !== myEvents[j].id
      ) {
        overlaps = true;
      }
    }
    for (let k = 0; k < notOverlappingEvents.length; k++) {
      if (
        myEvents[i].start <= notOverlappingEvents[k].end &&
        myEvents[i].end >= notOverlappingEvents[k].start &&
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

  // SECOND - for all overlapping events display then in several columns
  return splitOverlappingEventsInColumns(
    overlappingEvents,
    notOverlappingEvents,
  );
};

import { CalendarEvent } from 'types';
import config from 'config';

interface CalendarEventWithId {
  id: string;
  start: number;
  end: number;
}
interface Event {
  id: string;
  start: number;
  end: number;
  column: number;
  width: number;
}

const MAX_WIDTH = 600;

export const splitEventsInColumns: (arg0: CalendarEvent[]) => Event[] = (
  events,
) => {
  // Format events to ensure start and end values are relevant and add an id
  const myEvents: CalendarEventWithId[] = events.map((event, index) => ({
    id: `${index}`,
    start: event.start > 0 ? event.start : 0,
    end:
      event.end < config.displayedHours * 60
        ? event.end
        : config.displayedHours * 60,
  }));

  const firstColumnEvents: Event[] = [];
  const overlappingEvents: Event[] = [];
  // Iterate over all events and check for conflict
  myEvents.forEach(
    (event) => {
      const overlappingIds: string[] = [];
      for (let j = 0; j < myEvents.length; j++) {
        if (
          event.start < myEvents[j].end &&
          event.end > myEvents[j].start &&
          event.id !== myEvents[j].id
        ) {
          overlappingIds.push(myEvents[j].id);
        }
      }

      if (overlappingIds.length === 0) {
        firstColumnEvents.push({
          ...event,
          column: 0,
          width: MAX_WIDTH,
        });
      } else {
        let overlapsWithFirstCoumn = false;
        for (let k = 0; k < firstColumnEvents.length; k++) {
          if (
            event.start < firstColumnEvents[k].end &&
            event.end > firstColumnEvents[k].start &&
            event.id !== firstColumnEvents[k].id
          ) {
            overlapsWithFirstCoumn = true;
          }
        }

        if (!overlapsWithFirstCoumn) {
          firstColumnEvents.push({
            ...event,
            column: 0,
            width: MAX_WIDTH / 2, // basic implem for two columns
          });
        } else {
          overlappingEvents.push({
            ...event,
            column: 1,
            width: MAX_WIDTH / 2, // basic implem for two columns
          });
        }
      }
    },
    {} as Record<string, CalendarEventWithId>,
  );

  return firstColumnEvents.concat(overlappingEvents);
};

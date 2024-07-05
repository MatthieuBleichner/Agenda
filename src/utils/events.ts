import { CalendarEvent } from 'types';
import config from 'config';

interface CalendarEventWithId {
  id: string;
  start: number;
  end: number;
  conflictWith: string[];
}

interface Event {
  id: string;
  start: number;
  end: number;
  column: number;
  width: number;
}

const MAX_WIDTH = 600;
/**
 * Recursive function used to split conflicting events in several columns
 * @param events all available events
 * @param formatedEvents events already splitted in columns
 * @param overlappingEvents events to split
 * @param columnIndex next available column
 * @returns splitted events by columns. Key is the column number
 */
const splitOverlappingEventsInColumns: (
  arg0: Record<string, CalendarEventWithId>,
  arg1: Record<number, string[]>,
  arg2: CalendarEventWithId[],
  arg3: number,
) => Record<number, string[]> = (
  events,
  formatedEvents = {},
  overlappingEvents,
  columnIndex,
) => {
  if (overlappingEvents.length === 0) {
    return formatedEvents;
  }
  if (columnIndex === 0) {
    return formatedEvents;
  }

  const previousColumnsIds: string[] = Object.values(formatedEvents).reduce(
    (acc, events) => {
      acc = acc.concat(events);
      return acc;
    },
    [] as string[],
  );
  const currentEvent = overlappingEvents.shift();
  if (!currentEvent) {
    return formatedEvents;
  }

  const otherColumnEvents: CalendarEventWithId[] = [];
  const sameColumnEvents: string[] = [currentEvent.id];

  // Here we well run an algorithm to find all events displayable in one column
  // First add all events whithout any conflicts
  // Then for elements with conflicts, add those that do not conflicts with the first one
  overlappingEvents.forEach((event) => {
    // for event - check if it has unresolved conflicts (ie conflicting events not displayed in previous columns)
    const conflicts = event.conflictWith.filter((conflictingEvent) => {
      return !previousColumnsIds.find(
        (prevEvent) => prevEvent === conflictingEvent,
      );
    });

    // If it has no conflicts - add it to current column
    if (conflicts.length === 0) {
      // no more conflict add it to current column
      sameColumnEvents.push(event.id);
    } else {
      // check if it conflicts with current column events
      const conflictsWithCurrentcolum = event.conflictWith.filter(
        (conflictingEventId) => {
          return !sameColumnEvents.find(
            (eventIdFromSameColumn) =>
              eventIdFromSameColumn === conflictingEventId,
          );
        },
      );
      if (conflictsWithCurrentcolum.length === 0) {
        // no more conflict add it to current column
        sameColumnEvents.push(event.id);
      } else {
        otherColumnEvents.push(event);
      }
    }
  });

  const mergedFormatedEvents = {
    ...formatedEvents,
    [columnIndex]: sameColumnEvents,
  };

  return splitOverlappingEventsInColumns(
    events,
    mergedFormatedEvents,
    otherColumnEvents,
    columnIndex + 1,
  );
};

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
    conflictWith: [],
    column: 0,
  }));

  const eventsByColumn: Record<number, string[]> = { 0: [] }; // events splitted in columns, key is the colum number, value is the list of events ids
  const overlappingEvents: CalendarEventWithId[] = []; // events that conflicts in time with other one

  // In order to save perfromance, here we do a unique o(n2) loop:
  // - build an object containing all events. (Each events know the list of its conflicting events)
  // - build the list of events to display in first column (ie list of events that do not conflicts with themselves)
  // - build the list of events to display in next columns (ie has conflicts with first column)
  const allEvents: Record<string, CalendarEventWithId> = {};
  myEvents.forEach((event) => {
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
    allEvents[event.id] = {
      ...event,
      conflictWith: overlappingIds,
    };

    // if it does not have any conflicts add it to first column
    if (overlappingIds.length === 0) {
      eventsByColumn[0].push(event.id);
    } else {
      // if it has some conflicts add only those that do not conflict with first column's events
      let overlapsWithFirstCoumn = false;
      const firstColumnEventsIds = eventsByColumn[0];
      firstColumnEventsIds.forEach((eventId) => {
        const firstColumnEvent = allEvents[eventId];
        if (
          event.start < firstColumnEvent.end &&
          event.end > firstColumnEvent.start &&
          event.id !== firstColumnEvent.id
        ) {
          overlapsWithFirstCoumn = true;
        }
      });

      if (!overlapsWithFirstCoumn) {
        eventsByColumn[0].push(event.id);
      } else {
        overlappingEvents.push({
          ...event,
          conflictWith: overlappingIds,
        });
      }
    }
  });

  // if there aren't any conflicts - early rturn with all events
  if (overlappingEvents.length === 0) {
    return eventsByColumn[0].map((id) => ({
      ...allEvents[id],
      column: 0,
      width: MAX_WIDTH,
    }));
  }
  const allEventsByColumn = splitOverlappingEventsInColumns(
    allEvents,
    eventsByColumn,
    overlappingEvents,
    1,
  );

  const res: Record<string, Event> = {};
  // Recursive function used to set correct width of all events
  const adjustElementsWidth: (
    arg0: CalendarEventWithId,
    arg1: Record<string, CalendarEventWithId>,
    arg2: number,
    arg3: number,
  ) => void = (event, allEvents, column, width) => {
    if (!res[event.id]) {
      res[event.id] = {
        ...event,
        column,
        width,
      };
    } else {
      return;
    }
    event.conflictWith.forEach((conflictingId) => {
      if (!res[conflictingId]) {
        let col = column;
        let found = false;
        for (let i = column - 1; i >= 0; i--) {
          if (
            Object.values(allEventsByColumn[i]).find(
              (id) => id === conflictingId,
            )
          ) {
            found = true;
            col = i;
            break;
          }
        }
        // a expliquer, on va toujours du haut vers le bas
        if (found) {
          adjustElementsWidth(allEvents[conflictingId], allEvents, col, width);
        }
      }
    });
    return;
  };
  const numberOfColumns = Object.keys(allEventsByColumn).length;
  for (let i = numberOfColumns - 1; i >= 0; i--) {
    const columnEvents = allEventsByColumn[i].map((id) => allEvents[id]);
    columnEvents.forEach((event) => {
      adjustElementsWidth(event, allEvents, i, MAX_WIDTH / (i + 1));
    });
  }
  return Object.values(res);
};

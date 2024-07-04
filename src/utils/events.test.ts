import { splitEventsInColumns } from './events';
import { CalendarEvent } from 'types';

const singleEvent: CalendarEvent[] = [
  {
    start: 30,
    end: 60,
  },
];
const twoBasicEvents: CalendarEvent[] = [
  { start: 30, end: 60 },
  { start: 90, end: 120 },
];

const twoOverlappingEvents: CalendarEvent[] = [
  { start: 540, end: 600 },
  { start: 560, end: 620 },
];

const fourOverlappingEventsInThreeColumns: CalendarEvent[] = [
  { start: 30, end: 90 },
  { start: 60, end: 120 },
  { start: 60, end: 240 },
  { start: 180, end: 300 },
];

test('return valid result for one event', () => {
  const res = splitEventsInColumns(singleEvent);
  expect(res.length).toBe(1);
  expect(res[0].start).toBe(30);
  expect(res[0].end).toBe(60);
  expect(res[0].width).toBe(600);
  expect(res[0].column).toBe(0);
});

test('return valid result for two NOT overlapping events', () => {
  const res = splitEventsInColumns(twoBasicEvents);
  expect(res.length).toBe(2);
  expect(res[0].width).toBe(600);
  expect(res[0].column).toBe(0);
  expect(res[1].width).toBe(600);
  expect(res[1].column).toBe(0);
});

test('return valid result when an event starts just after an other finish', () => {
  const events: CalendarEvent[] = [
    { start: 30, end: 60 },
    { start: 60, end: 90 },
  ];
  const res = splitEventsInColumns(events);
  expect(res.length).toBe(2);
  expect(res[0].width).toBe(600);
  expect(res[0].column).toBe(0);
  expect(res[1].width).toBe(600);
  expect(res[1].column).toBe(0);
});

test('return valid result when several events overlapp at different time', () => {
  const events: CalendarEvent[] = [
    { start: 30, end: 60 },
    { start: 50, end: 90 },
    { start: 240, end: 270 },
    { start: 300, end: 330 },
    { start: 220, end: 310 },
  ];
  const res = splitEventsInColumns(events);
  const orderedRes = res.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  console.log('res', orderedRes);
  expect(orderedRes.length).toBe(5);
  expect(orderedRes[0].width).toBe(300);
  expect(orderedRes[0].column).toBe(0);
  expect(orderedRes[1].width).toBe(300);
  expect(orderedRes[1].column).toBe(1);
  expect(orderedRes[2].width).toBe(300);
  expect(orderedRes[2].column).toBe(0);
  expect(orderedRes[3].width).toBe(300);
  expect(orderedRes[3].column).toBe(0);
  expect(orderedRes[4].width).toBe(300);
  expect(orderedRes[4].column).toBe(1);
});

// test('return valid result when two events overlap', () => {
//   const res = splitEventsInColumns(twoOverlappingEvents);
//   expect(res.length).toBe(2);
//   expect(res[0].width).toBe(300);
//   expect(res[0].column).toBe(0);
//   expect(res[1].width).toBe(300);
//   expect(res[1].column).toBe(1);
// });

// test('return valid result in complex use case when four events overlap and should be displayed in 3 columns', () => {
//   const res = buildEventsOverlappingArray(fourOverlappingEventsInThreeColumns);

//   console.log('res', res);
//   expect(res.length).toBe(4);
//   expect(res[0].width).toBe(200);
//   //expect(res[0].column).toBe(0);
//   expect(res[1].width).toBe(200);
//   //expect(res[1].column).toBe(1);
//   expect(res[2].width).toBe(200);
//   //expect(res[2].column).toBe(2);
//   expect(res[3].width).toBe(200);
//   //expect(res[3].column).toBe(0);
// });

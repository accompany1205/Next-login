import { addDays, endOfDay, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import type { CalendarEvent } from '../types/calendar';
import { createResourceId } from '../utils/create-resource-id';
import { deepCopy } from '../utils/deep-copy';
import axios from '../utils/axios';

const now = new Date();

let events: CalendarEvent[] = [
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: false,
    color: '#FFB020',
    description: 'Inform about new contract',
    end: setHours(setMinutes(subDays(now, 6), 0), 19).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 30), 17).getTime(),
    title: 'Call Samantha'
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: false,
    color: '#14B8A6',
    description: 'Discuss about new partnership',
    end: setHours(setMinutes(addDays(now, 2), 30), 15).getTime(),
    start: setHours(setMinutes(addDays(now, 2), 0), 12).getTime(),
    title: 'Meet with IBM'
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: false,
    color: '#2196F3',
    description: 'Prepare docs',
    end: setHours(setMinutes(addDays(now, 5), 0), 12).getTime(),
    start: setHours(setMinutes(addDays(now, 5), 0), 8).getTime(),
    title: 'SCRUM Planning'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    color: '#D14343',
    description: 'Meet with team to discuss',
    end: startOfDay(subDays(now, 11)).getTime(),
    start: endOfDay(subDays(now, 12)).getTime(),
    title: 'Begin SEM'
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: false,
    color: '#14B8A6',
    description: 'Sorry, John!',
    end: setHours(setMinutes(addDays(now, 3), 31), 7).getTime(),
    start: setHours(setMinutes(addDays(now, 3), 30), 7).getTime(),
    title: 'Fire John'
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: false,
    color: '#10B981',
    description: 'Discuss about the new project',
    end: setHours(setMinutes(subDays(now, 6), 30), 9).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 0), 9).getTime(),
    title: 'Call Alex'
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: false,
    color: '#2196F3',
    description: 'Get a new quote for the payment processor',
    end: setHours(setMinutes(now, 30), 17).getTime(),
    start: setHours(setMinutes(now, 30), 15).getTime(),
    title: 'Visit Samantha'
  }
];

type GetEventsRequest = {};

type GetEventsResponse = Promise<CalendarEvent[]>;

type CreateEventRequest = {
  allDay: boolean;
  description: string;
  end: number;
  start: number;
  title: string;
}

type CreateEventResponse = Promise<CalendarEvent>

type UpdateEventRequest = {
  eventId: string;
  update: {
    allDay?: boolean;
    description?: string;
    end?: number;
    start?: number;
    title?: string;
  };
}

type UpdateEventResponse = Promise<CalendarEvent>;

type DeleteEventRequest = {
  eventId: string;
}

type DeleteEventResponse = Promise<true>

class CalendarApi {
  getEvents(request?: GetEventsRequest): GetEventsResponse {
    return new Promise((resolve, reject) => {
      try {
        new Promise((resolve, reject) => {
          try {
            resolve(axios.get('/api/calendar-event/getEvents'))
          } catch (err) {
            console.error('[Calendar Api]: ', err);
            reject(new Error('Internal server error'));
          }
        }).then((result: any) => {
          console.log('geteventlist', result);
          let eventlist: CalendarEvent[] = [];
          result.data.lists.map((item: any) => eventlist.push(deepCopy(item)));
          resolve(eventlist);

        });
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    })
  }

  createEvent(request: CreateEventRequest): CreateEventResponse {
    const {
      allDay,
      description,
      end,
      start,
      title
    } = request;

    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Create the new event
        const event = {
          allDay,
          description,
          end,
          start,
          title
        };
        console.log(event);
        new Promise((resolve, reject) => {
          try {
            resolve(axios.post('/api/calendar-event/create', { event }))
          } catch (err) {
            console.error('[Calendar Api]: ', err);
            reject(new Error('Internal server error'));
          }

        }).then((result: any) => {
          console.log(result);
          //clonedEvents.push(result.data);
          resolve(deepCopy(result.data));

        });
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateEvent(request: UpdateEventRequest): UpdateEventResponse {
    const { eventId, update } = request;

    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Create the new event

        console.log(update);
        new Promise((resolve, reject) => {
          try {
            resolve(axios.post('/api/calendar-event/update',
              {
                id: eventId,
                update: update
              }))
          } catch (err) {
            console.error('[Calendar Api]: ', err);
            reject(new Error('Internal server error'));
          }

        }).then((result: any) => {
          console.log(result);
          //clonedEvents.push(result.data);
          resolve(deepCopy(result.data));

        });
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteEvent(request: DeleteEventRequest): DeleteEventResponse {
    const { eventId } = request;

    return new Promise((resolve, reject) => {
      try {
        new Promise((resolve, reject) => {
          try {
            resolve(axios.post('/api/calendar-event/delete',
              {
                id: eventId,
              }))
          } catch (err) {
            console.error('[Calendar Api]: ', err);
            reject(new Error('Internal server error'));
          }

        }).then((result: any) => {
          resolve(true);
        });
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const calendarApi = new CalendarApi();

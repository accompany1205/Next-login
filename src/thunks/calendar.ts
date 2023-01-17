import { calendarApi } from '../api/calendar-api';
import { slice } from '../slices/calendar';
import { AppThunk } from '../store';

export const getEvents = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await calendarApi.getEvents();
  console.log('thunk-getEvents', response);
  dispatch(slice.actions.getEvents(response));
};

type CreateEventParams = {
  allDay: boolean;
  description: string;
  end: number;
  start: number;
  title: string;
};

export const createEvent = (params: CreateEventParams): AppThunk => async (dispatch): Promise<void> => {
  console.log("thunk-createEvent", params);
  const response = await calendarApi.createEvent(params);

  dispatch(slice.actions.createEvent(response));
};

type UpdateEventParams = {
  eventId: string;
  update: {
    allDay?: boolean;
    description?: string;
    end?: number;
    start?: number;
    title?: string;
  };
};

export const updateEvent = (params: UpdateEventParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await calendarApi.updateEvent(params);

  dispatch(slice.actions.updateEvent(response));
};

type DeleteEventParams = {
  eventId: string;
};

export const deleteEvent = (params: DeleteEventParams): AppThunk => async (dispatch): Promise<void> => {
  await calendarApi.deleteEvent(params);

  dispatch(slice.actions.deleteEvent(params.eventId));
};

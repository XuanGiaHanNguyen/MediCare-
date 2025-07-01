// src/utils/constants.js
export const EVENT_TYPES = {
  APPOINTMENT: 'appointment',
  MEETING: 'meeting'
};

export const EVENT_COLORS = {
  APPOINTMENT: 'bg-blue-500',
  MEETING: 'bg-green-500',
  GOOGLE_CALENDAR: 'bg-purple-500'
};

export const SESSION_TYPES = {
  ONLINE: 'online',
  IN_PERSON: 'in-person',
  HYBRID: 'hybrid'
};

export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// Future Google integration constants
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

export const GOOGLE_DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
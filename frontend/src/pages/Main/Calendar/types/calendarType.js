export const EventType = {
  id: 'string',
  title: 'string',
  time: 'string',
  date: 'string',
  description: 'string',
  location: 'string',
  url: 'string',
  color: 'string',
  type: 'string', // 'appointment' | 'meeting'
  approved: 'boolean',
  approval: 'boolean',
  user: 'string',
  participants: 'array',
  duration: 'number',
  session: 'string', // 'online' | 'in-person' | 'hybrid'
  userId: 'string'
};

export const CalendarProps = {
  currentDate: 'Date',
  selectedDate: 'Date',
  events: 'object', // { [dateString]: Event[] }
  onDateSelect: 'function',
  onNavigateMonth: 'function',
  isToday: 'function',
  isSelected: 'function',
  getEventsForDate: 'function'
};

export const EventCardProps = {
  event: 'EventType',
  userId: 'string',
  onRefreshEvents: 'function'
};
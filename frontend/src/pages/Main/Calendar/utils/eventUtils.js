export const transformEventData = (event, type, color, userName, currentUserId) => {
  return {
    id: `${event.id}`,
    title: event.title || (type === "appointment" ? "Appointment" : "Meeting"),
    time: event.time || event.startTime,
    description: event.description || event.notes || event.agenda,
    location: event.location,
    url: event.meetingUrl || event.url,
    color,
    type,
    approved: event.approved || false,
    approval: event.userId !== currentUserId,
    user: userName,
    participants: event.participants,
    duration: event.duration,
    session: event.session || "in-person",
    date: event.date,
    ...event
  };
};

export const getEventStatusColor = (event) => {
  if (!event.approved) return "bg-yellow-100 text-yellow-800";
  if (event.approved) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

export const getEventStatusText = (event) => {
  if (!event.approved) return "Pending";
  if (event.approved) return "Approved";
  return "Unknown";
};

export const canUserApproveEvent = (event, currentUserId) => {
  return event.approved === false && event.approval === true;
};

export const canUserJoinMeeting = (event) => {
  return event.approved === true && event.session === "online" && event.url;
};

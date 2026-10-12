// True when the timestamp falls on the current local calendar day.
export const isToday = (timestamp: number, now = Date.now()) =>
  new Date(timestamp).toDateString() === new Date(now).toDateString();

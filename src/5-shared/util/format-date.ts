const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export const formatDate = (timestamp: number) => {
  const parts = Object.fromEntries(
    dateFormatter
      .formatToParts(timestamp)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}. ${parts.month}. ${parts.day}.\n${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
};

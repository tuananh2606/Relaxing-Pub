const ConvertToHourAndMinutes = (totalMinutes: number | undefined) => {
  if (totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}h${minutes}m`;
  }
};

export default ConvertToHourAndMinutes;

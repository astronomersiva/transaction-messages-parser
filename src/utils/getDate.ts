export default function getDate(dateString: string | undefined): string | null {
  if (!dateString) {
    return null;
  }

  const parts = dateString.split('-').map(part => part.split(':')).flat();

  if (parts.length === 2) {
    parts.push(new Date().getFullYear().toString().slice(2));
  }

  const date = new Date();
  date.setMonth(parseInt(parts[1]) - 1, parseInt(parts[0]));
  date.setFullYear(parts[2].length === 2 ? 2000 + parseInt(parts[2]) : parseInt(parts[2]));

  const hours = parseInt(parts[3]) || 0;
  const minutes = parseInt(parts[4]) || 0;
  const seconds = parseInt(parts[5]) || 0;

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date.toString();
}

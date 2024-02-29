import getDate from './getDate.js';

const months = {
  'jan': '01',
  'feb': '02',
  'mar': '03',
  'apr': '04',
  'may': '05',
  'jun': '06',
  'jul': '07',
  'aug': '08',
  'sep': '09',
  'oct': '10',
  'nov': '11',
  'dec': '12',
};

function getMonthNumber(month: keyof typeof months): typeof months[keyof typeof months]{
  return months[month];
}

export default function formatDateWithMonth(dateString: string): string | null {
  const parts = dateString.split('-');
  const date = parts[0];
  const month = getMonthNumber(parts[1].toLowerCase() as keyof typeof months);
  const year = parts[2];

  return getDate(`${date}-${month}-${year}`);
}

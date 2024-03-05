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
  'january': '01',
  'february': '02',
  'march': '03',
  'april': '04',
  // 'may': '05', already exists
  'june': '06',
  'july': '07',
  'august': '08',
  'september': '09',
  'october': '10',
  'november': '11',
  'december': '12',
};

function getMonthNumber(month: keyof typeof months): typeof months[keyof typeof months]{
  return months[month];
}

export function formatDateWithMonth(date: string, month: string, year: string, hours?: string, mins?: string): string | null {
  const monthNumber = getMonthNumber(month.toLowerCase() as keyof typeof months);
  return getDate(`${date}-${monthNumber}-${year}${hours ? `:${hours}:${mins}` : ''}`);
}

export function formatDateStringWithMonth(dateString: string): string | null {
  const parts = dateString.split('-');
  return formatDateWithMonth(parts[0], parts[1], parts[2]);
}

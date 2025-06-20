export function parseCustomDate(dateStr) {
  const [day, monthStr, year] = dateStr.split(' ');
  const month = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ].indexOf(monthStr);
  return new Date(Number(year), month, Number(day));
}
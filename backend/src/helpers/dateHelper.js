export function parseCustomDate(dateStr) {
  const [day, monthStr, year] = dateStr.split(' ');
  const month = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ].indexOf(monthStr);
  return new Date(Number(year), month, Number(day));
}

export function formatReadableDateTime(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';

  const pad = (val) => String(val).padStart(2, '0');
  const day = pad(d.getDate());
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}
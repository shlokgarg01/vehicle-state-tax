export const getDateFromDateString = (dateTime) => {
  const date = new Date(dateTime)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
  return formattedDate
}

export const getDateTimeFromDateString = (dateTime) => {
  const date = new Date(dateTime)
  const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date)
  return formattedDateTime
}

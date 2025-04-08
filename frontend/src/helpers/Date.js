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
<<<<<<< HEAD
=======

export const formattedDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0') // Ensure 2-digit format
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  const formattedDate = `${day}-${month}-${year}`
  return formattedDate
}
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

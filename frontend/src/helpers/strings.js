export const removeUnderScoreAndCapitalize = (str) => {
  if (!str) return ''
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

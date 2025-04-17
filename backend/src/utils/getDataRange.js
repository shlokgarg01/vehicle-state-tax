export const getDateRange = (filter, fromDate, toDate) => {
  const now = new Date();
  let from,
    to = new Date();

  switch (filter) {
    case "1d":
      from = new Date();
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "5d":
      from = new Date();
      from.setDate(from.getDate() - 5);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "10d":
      from = new Date();
      from.setDate(from.getDate() - 10);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "lastWeek":
      from = new Date();
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "lastMonth":
      from = new Date();
      from.setMonth(from.getMonth() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "lastYear":
      from = new Date();
      from.setFullYear(from.getFullYear() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case "custom":
      if (fromDate && toDate) {
        return {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }
      break;

    default:
      // Default to lastMonth behavior
      from = new Date();
      from.setMonth(from.getMonth() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
  }

  return {
    $gte: from,
    $lte: to,
  };
};

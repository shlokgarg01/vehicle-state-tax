// ignore this page

export const getDateRange = (filter, fromDate, toDate) => {
  const now = new Date();
  let from,
    to = new Date();

  switch (filter) {
    case "1d":
      from = new Date();
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0); // Start of day
      to.setHours(23, 59, 59, 999); // End of day
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

    case "lastMonth":
      from = new Date();
      from.setMonth(from.getMonth() - 1);
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

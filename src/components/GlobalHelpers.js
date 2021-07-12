export const getFormattedDate = (date) => {
  const newDate = new Date(date);

  const result = `${newDate.getFullYear()}-${
    (newDate.getMonth() + 1 < 10 ? "0" : "") + (newDate.getMonth() + 1)
  }-${(newDate.getDate() < 10 ? "0" : "") + newDate.getDate()}`;
  console.log(result);
  return result;
};

export const getTimeFromDate = (date) => {
  const newTime = new Date(date);
  return `${(newTime.getHours() < 10 ? "0" : "") + newTime.getHours()}:${
    (newTime.getMinutes() < 10 ? "0" : "") + newTime.getMinutes()
  }`;
};

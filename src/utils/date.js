import moment from "moment";

export const formatDate = dateString => {
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  return new Date(moment(dateString, 'YYYY-MM-DDTHH:mm:ss.SSSZ')).toLocaleDateString('en-GB', options);
};

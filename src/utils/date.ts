const currentDate = new Date();
const formattedDate = currentDate.toISOString().split('T')[0];
export { currentDate, formattedDate };

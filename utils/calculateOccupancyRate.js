export const calculateOccupancyRate = (occupied, total) => {
  if (total === 0) return 0;
  return ((occupied / total) * 100).toFixed(2);
};

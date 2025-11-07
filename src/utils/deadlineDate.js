// ✅ Safely parse Australian date string
export const parseAustralianDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ Calculate remaining days until deadline
export const getDaysRemaining = (dateString) => {
  const deadlineDate = parseAustralianDate(dateString);
  if (!deadlineDate) return null; // Handle invalid date

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();

  // If already past, return null
  if (diffTime < 0) return null;

  // Return number of days left (integer)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

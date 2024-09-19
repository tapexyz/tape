export const checkEventExistence = (
  obj: Record<string, unknown>,
  event: string
): boolean => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      if (checkEventExistence(value as Record<string, unknown>, event)) {
        return true;
      }
    } else if (value === event) {
      return true;
    }
  }
  return false;
};

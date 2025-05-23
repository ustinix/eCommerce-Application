export const encodeToken = (token: string): string => {
  return btoa(encodeURIComponent(token));
};

export const decodeToken = (encoded: string): string => {
  return decodeURIComponent(atob(encoded));
};

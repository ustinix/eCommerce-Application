export const encodeToken = (token) => {
    return btoa(encodeURIComponent(token));
};
export const decodeToken = (encoded) => {
    return decodeURIComponent(atob(encoded));
};

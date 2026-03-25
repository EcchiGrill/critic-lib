export const getCookie = (name: string) => {
  const parsedCookies = document.cookie
    .split('; ')
    .map((cookie) => cookie.split('='));
  const cookies = Object.fromEntries(parsedCookies);
  return cookies[name] || null;
};

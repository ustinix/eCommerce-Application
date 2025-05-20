export function isEmail(email: string): boolean {
  const regex = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

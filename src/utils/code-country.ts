export function getCountryCode(country: string): string {
  return country === 'Russia' ? 'RU' : 'US';
}

export function getCountryName(code: string): string {
  return code === 'RU' ? 'Russia' : 'United States';
}

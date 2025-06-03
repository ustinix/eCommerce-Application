const dollarSing = '$';
export function formatPrice(price: number): string {
  return `${dollarSing}${(price / 100).toFixed(2)}`;
}

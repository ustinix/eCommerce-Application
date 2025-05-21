export default function validateStreet(value: string): string {
  if (!value.trim()) {
    return 'Street address is required';
  }
  return '';
}

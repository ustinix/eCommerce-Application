export function isPassword(value: string): boolean {
  return (
    value.length < 8 ||
    !/[A-Z]/.test(value) ||
    !/[a-z]/.test(value) ||
    !/\d/.test(value) ||
    !/[!#$%&*@^]/.test(value)
  );
}

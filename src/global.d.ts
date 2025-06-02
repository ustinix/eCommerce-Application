declare let setTimeout: (
  handler: (...arguments_: unknown[]) => void,
  timeout?: number,
  ...arguments_: unknown[]
) => number;
declare let clearTimeout: (timeoutId?: number) => void;

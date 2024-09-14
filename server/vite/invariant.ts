// https://github.com/remix-run/remix/blob/main/packages/remix-dev/invariant.ts

export default function invariant(
  value: boolean,
  message?: string,
): asserts value;

export default function invariant<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message);
  }
}

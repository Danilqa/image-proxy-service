export function toNumber(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  return Number(value);
}

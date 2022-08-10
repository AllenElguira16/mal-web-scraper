export function serializeError(err: unknown) {
  return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
}

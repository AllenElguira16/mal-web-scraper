export class FetchError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

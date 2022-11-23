export class MALResponseError extends Error {
  // public code: number;

  constructor(public code: number, public id: number, public message: string) {
    super(message);
  }
}

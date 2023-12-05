export class RequestError extends Error {
  constructor(public code: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  public toString = (): string => {
    return `RequestError: ${this.message}`;
  };
}

export class AppError extends Error {
  statusCode: number;
  code: string;
  fields?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}

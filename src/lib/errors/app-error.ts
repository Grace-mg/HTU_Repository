export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DataSourceNotConfiguredError extends AppError {
  constructor(message = "The application data source has not been configured.") {
    super(message, 503, "DATA_SOURCE_NOT_CONFIGURED");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be logged in to perform this action.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to access this resource.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  public readonly errors?: Record<string, string[]>;

  constructor(message = "Invalid parameters provided.", errors?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export default class OpError extends Error {
  _statusCode: number;
  _status: string;
  _message: string;
  _isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this._statusCode = statusCode;
    this._status =
      statusCode >= 200 && statusCode < 400 ? "Success" : statusCode >= 400 && statusCode < 500 ? "Fail" : "Error";
    this._message = message;
    this._isOperational = true;
  }
}

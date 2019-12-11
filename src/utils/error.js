import _ from 'lodash';

export class ReqError extends Error {
  constructor(type, payload) {
    super(type);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReqError);
    }

    this.name = 'ReqError';
    this.timestamp = _.now();
    this.type = type;
    this.payload = payload;
  }
}

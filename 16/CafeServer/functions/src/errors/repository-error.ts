import { ErrorDetail } from './errors';

export class RepositoryError extends Error {
  constructor(public readonly detail: ErrorDetail) {
    super(detail.message);
  }
}


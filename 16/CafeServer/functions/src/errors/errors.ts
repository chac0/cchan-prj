import * as uuid from 'uuid';
import * as functions from 'firebase-functions';

import { RepositoryError } from './repository-error';

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface Details {
  code: string;
  uid: string;
}

export const instanceOfDetails = (object: unknown): object is Details =>
  typeof object === 'object' && object ? 'code' in object && 'uid' in object : false;

const errorDetail = (code: string, message: string): ErrorDetail => {
  return { code, message };
};

// クライアントに返却される可能性のあるエラーコード
export const ZEROCAFE_UNAUTHENTICATED = errorDetail('ZC01', '未認証です');
export const ZEROCAFE_PERMISSION_DENIED = errorDetail('ZC02', '権限がありません');
export const ZEROCAFE_INTERNAL = errorDetail('ZC03', '不明なエラーです');
export const ZEROCAFE_DATA_NOT_FOUND = errorDetail('ZC04', 'データが見つかりません');

export const JOI_INVALID = errorDetail('JO01', 'パラメーターが不正です');

// サーバー内部のみで利用するエラーコード
export const INTERNAL_INVALID_PARAMETERS = errorDetail('IE01', 'パラメータが不正です');
export const INTERNAL_UNKNOWN = errorDetail('IE02', '不明なエラーです');

const e = (code: functions.https.FunctionsErrorCode, message: string, label: string) =>
  new functions.https.HttpsError(code, message, { code: label, uid: uuid.v4().substring(0, 8) });

// Https Errors
export const newPermissionDeniedError = (detail: ErrorDetail) => e('permission-denied', '権限が不正です', detail.code);
export const newInvalidArgumentError = (detail: ErrorDetail) => e('invalid-argument', detail.message, detail.code);
export const newNotFoundError = (detail: ErrorDetail) => e('not-found', detail.message, detail.code);
export const newFailedPreconditionError = (detail: ErrorDetail) => e('failed-precondition', detail.message, detail.code);
export const newInternalError = () => e('internal', 'Internal Error', ZEROCAFE_INTERNAL.code);

// Repository Error
export const newRepositoryError = (detail: ErrorDetail | string) =>
  typeof detail === 'string' ? new RepositoryError(errorDetail('REPO_ERR', detail)) : new RepositoryError(detail);

//
// Firestore error codes
//

export type FirestoreErrorCode =
  | 'cancelled'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated';

const FIRESTORE_CANCELLED = errorDetail('FS01', 'The operation was cancelled.');
const FIRESTORE_UNKNOWN = errorDetail('FS02', 'Unknown error or an error from a different error domain.');
const FIRESTORE_INVALID_ARGUMENT = errorDetail('FS03', 'Client specified an invalid argument.');
const FIRESTORE_DEADLINE_EXCEEDED = errorDetail('FS04', 'Deadline expired before operation could complete.');
const FIRESTORE_NOT_FOUND = errorDetail('FS05', 'Some requested document was not found.');
const FIRESTORE_ALREADY_EXISTS = errorDetail('FS06', 'Some document that we attempted to create already exists.');
const FIRESTORE_PERMISSION_DENIED = errorDetail('FS07', 'The caller does not have permission to execute the specified operation.');
const FIRESTORE_RESOURCE_EXHAUSTED = errorDetail('FS08', 'Some resource has been exhausted.');
const FIRESTORE_FAILED_PRECONDITION = errorDetail(
  'FS09',
  "Operation was rejected because the system is not in a state required for the operation's execution."
);
const FIRESTORE_ABORTED = errorDetail('FS10', 'The operatFIRESTORE_ion was aborted.');
const FIRESTORE_OUT_OF_RANGE = errorDetail('FS11', 'Operation was attempted past the valid range.');
const FIRESTORE_UNIMPLEMENTED = errorDetail('FS12', 'Operation is not implemented or not supported/enabled.');
const FIRESTORE_INTERNAL = errorDetail('FS13', 'Internal errors. Means some invariants expected by underlying system has been broken.');
const FIRESTORE_UNAVAILABLE = errorDetail(
  'FS14',
  'The service is currently unavailable. This is most likely a transient condition and may be corrected by retrying with a backoff.'
);
const FIRESTORE_DATA_LOSS = errorDetail('FS15', 'Unrecoverable data loss or corruption.');
const FIRESTORE_UNAUTHENTICATED = errorDetail('FS16', 'The request does not have valid authentication credentials for the operation.');

export function getFirestoreErrorDetail(code: FirestoreErrorCode): ErrorDetail {
  return code === 'cancelled'
    ? FIRESTORE_CANCELLED
    : code === 'unknown'
    ? FIRESTORE_UNKNOWN
    : code === 'invalid-argument'
    ? FIRESTORE_INVALID_ARGUMENT
    : code === 'deadline-exceeded'
    ? FIRESTORE_DEADLINE_EXCEEDED
    : code === 'not-found'
    ? FIRESTORE_NOT_FOUND
    : code === 'already-exists'
    ? FIRESTORE_ALREADY_EXISTS
    : code === 'permission-denied'
    ? FIRESTORE_PERMISSION_DENIED
    : code === 'resource-exhausted'
    ? FIRESTORE_RESOURCE_EXHAUSTED
    : code === 'failed-precondition'
    ? FIRESTORE_FAILED_PRECONDITION
    : code === 'aborted'
    ? FIRESTORE_ABORTED
    : code === 'out-of-range'
    ? FIRESTORE_OUT_OF_RANGE
    : code === 'unimplemented'
    ? FIRESTORE_UNIMPLEMENTED
    : code === 'internal'
    ? FIRESTORE_INTERNAL
    : code === 'unavailable'
    ? FIRESTORE_UNAVAILABLE
    : code === 'data-loss'
    ? FIRESTORE_DATA_LOSS
    : code === 'unauthenticated'
    ? FIRESTORE_UNAUTHENTICATED
    : INTERNAL_UNKNOWN;
}

//
// Firebase auth error codes
//

type FirebaseAuthErrorCode =
  | 'auth/claims-too-large'
  | 'auth/id-token-expired'
  | 'auth/id-token-revoked'
  | 'auth/invalid-argument'
  | 'auth/invalid-claims'
  | 'auth/invalid-continue-uri'
  | 'auth/invalid-creation-time'
  | 'auth/invalid-disabled-field'
  | 'auth/invalid-display-name'
  | 'auth/invalid-dynamic-link-domain'
  | 'auth/invalid-email-verified'
  | 'auth/invalid-email'
  | 'auth/invalid-hash-algorithm'
  | 'auth/invalid-hash-block-size'
  | 'auth/invalid-hash-derived-key-length'
  | 'auth/invalid-hash-key'
  | 'auth/invalid-hash-memory-cost'
  | 'auth/invalid-hash-parallelization'
  | 'auth/invalid-hash-rounds'
  | 'auth/invalid-hash-salt-separator'
  | 'auth/invalid-id-token'
  | 'auth/invalid-last-sign-in-time'
  | 'auth/invalid-page-token'
  | 'auth/invalid-password'
  | 'auth/invalid-password-hash'
  | 'auth/invalid-password-salt'
  | 'auth/invalid-phone-number'
  | 'auth/invalid-photo-url'
  | 'auth/invalid-provider-data'
  | 'auth/invalid-provider-id	'
  | 'auth/invalid-session-cookie-duration'
  | 'auth/invalid-uid'
  | 'auth/invalid-user-import'
  | 'auth/maximum-user-count-exceeded'
  | 'auth/missing-android-pkg-name'
  | 'auth/missing-continue-uri'
  | 'auth/missing-hash-algorithm'
  | 'auth/missing-ios-bundle-id'
  | 'auth/missing-uid'
  | 'auth/reserved-claims'
  | 'auth/session-cookie-expired'
  | 'auth/session-cookie-revoked'
  | 'auth/uid-already-exists'
  | 'auth/unauthorized-continue-uri'
  | 'auth/email-already-exists'
  | 'auth/user-not-found'
  | 'auth/operation-not-allowed'
  | 'auth/invalid-credential'
  | 'auth/phone-number-already-exists'
  | 'auth/project-not-found'
  | 'auth/insufficient-permission'
  | 'auth/internal-error';

const FIREBASE_AUTH_CLAIMS_TOO_LARGE = errorDetail('FA01', 'auth/claims-too-large');
const FIREBASE_AUTH_ID_TOKEN_EXPIRED = errorDetail('FA02', 'auth/id-token-expired');
const FIREBASE_AUTH_ID_TOKEN_REVOKED = errorDetail('FA03', 'auth/id-token-revoked');
const FIREBASE_AUTH_INVALID_ARGUMENT = errorDetail('FA04', 'auth/invalid-argument');
const FIREBASE_AUTH_INVALID_CLAIMS = errorDetail('FA05', 'auth/invalid-claims');
const FIREBASE_AUTH_INVALID_CONTINUE_URI = errorDetail('FA06', 'auth/invalid-continue-uri');
const FIREBASE_AUTH_INVALID_CREATION_TIME = errorDetail('FA07', 'auth/invalid-creation-time');
const FIREBASE_AUTH_INVALID_DISABLED_FIELD = errorDetail('FA08', 'auth/invalid-disabled-field');
const FIREBASE_AUTH_INVALID_DISPLAY_NAME = errorDetail('FA09', 'auth/invalid-display-name');
const FIREBASE_AUTH_INVALID_DYNAMIC_LINK_DOMAIN = errorDetail('FA10', 'auth/invalid-dynamic-link-domain');
const FIREBASE_AUTH_INVALID_EMAIL_VERIFIED = errorDetail('FA11', 'auth/invalid-email-verified');
const FIREBASE_AUTH_INVALID_EMAIL = errorDetail('FA12', 'auth/invalid-email');
const FIREBASE_AUTH_INVALID_HASH_ALGORITHM = errorDetail('FA13', 'auth/invalid-hash-algorithm');
const FIREBASE_AUTH_INVALID_HASH_BLOCK_SIZE = errorDetail('FA14', 'auth/invalid-hash-block-size');
const FIREBASE_AUTH_INVALID_HASH_DERIVED_KEY_LENGTH = errorDetail('FA15', 'auth/invalid-hash-derived-key-length');
const FIREBASE_AUTH_INVALID_HASH_KEY = errorDetail('FA16', 'auth/invalid-hash-key');
const FIREBASE_AUTH_INVALID_HASH_MEMORY_COST = errorDetail('FA17', 'auth/invalid-hash-memory-cost');
const FIREBASE_AUTH_INVALID_HASH_PARALLELIZATION = errorDetail('FA18', 'auth/invalid-hash-parallelization');
const FIREBASE_AUTH_INVALID_HASH_ROUNDS = errorDetail('FA19', 'auth/invalid-hash-rounds');
const FIREBASE_AUTH_INVALID_HASH_SALT_SEPARATOR = errorDetail('FA20', 'auth/invalid-hash-salt-separator');
const FIREBASE_AUTH_INVALID_ID_TOKEN = errorDetail('FA21', 'auth/invalid-id-token');
const FIREBASE_AUTH_INVALID_LAST_SIGN_IN_TIME = errorDetail('FA22', 'auth/invalid-last-sign-in-time');
const FIREBASE_AUTH_INVALID_PAGE_TOKEN = errorDetail('FA23', 'auth/invalid-page-token');
const FIREBASE_AUTH_INVALID_PASSWORD = errorDetail('FA24', 'auth/invalid-password');
const FIREBASE_AUTH_INVALID_PASSWORD_HASH = errorDetail('FA25', 'auth/invalid-password-hash');
const FIREBASE_AUTH_INVALID_PASSWORD_SALT = errorDetail('FA26', 'auth/invalid-password-salt');
const FIREBASE_AUTH_INVALID_PHONE_NUMBER = errorDetail('FA27', 'auth/invalid-phone-number');
const FIREBASE_AUTH_INVALID_PHOTO_URL = errorDetail('FA28', 'auth/invalid-photo-url');
const FIREBASE_AUTH_INVALID_PROVIDER_DATA = errorDetail('FA29', 'auth/invalid-provider-data');
const FIREBASE_AUTH_INVALID_PROVIDER_ID = errorDetail('FA30', 'auth/invalid-provider-id	');
const FIREBASE_AUTH_INVALID_SESSION_COOKIE_DURATION = errorDetail('FA31', 'auth/invalid-session-cookie-duration');
const FIREBASE_AUTH_INVALID_UID = errorDetail('FA32', 'auth/invalid-uid');
const FIREBASE_AUTH_INVALID_USER_IMPORT = errorDetail('FA33', 'auth/invalid-user-import');
const FIREBASE_AUTH_MAXIMUM_USER_COUNT_EXCEEDED = errorDetail('FA34', 'auth/maximum-user-count-exceeded');
const FIREBASE_AUTH_MISSING_ANDROID_PKG_NAME = errorDetail('FA35', 'auth/missing-android-pkg-name');
const FIREBASE_AUTH_MISSING_CONTINUE_URI = errorDetail('FA36', 'auth/missing-continue-uri');
const FIREBASE_AUTH_MISSING_HASH_ALGORITHM = errorDetail('FA37', 'auth/missing-hash-algorithm');
const FIREBASE_AUTH_MISSING_IOS_BUNDLE_ID = errorDetail('FA38', 'auth/missing-ios-bundle-id');
const FIREBASE_AUTH_MISSING_UID = errorDetail('FA39', 'auth/missing-uid');
const FIREBASE_AUTH_RESERVED_CLAIMS = errorDetail('FA40', 'auth/reserved-claims');
const FIREBASE_AUTH_SESSION_COOKIE_EXPIRED = errorDetail('FA41', 'auth/session-cookie-expired');
const FIREBASE_AUTH_SESSION_COOKIE_REVOKED = errorDetail('FA42', 'auth/session-cookie-revoked');
const FIREBASE_AUTH_UID_ALREADY_EXISTS = errorDetail('FA43', 'auth/uid-already-exists');
const FIREBASE_AUTH_UNAUTHORIZED_CONTINUE_URI = errorDetail('FA44', 'auth/unauthorized-continue-uri');
const FIREBASE_AUTH_EMAIL_ALREADY_EXISTS = errorDetail('FA45', 'auth/email-already-exists');
const FIREBASE_AUTH_USER_NOT_FOUND = errorDetail('FA46', 'auth/user-not-found');
const FIREBASE_AUTH_OPERATION_NOT_ALLOWED = errorDetail('FA47', 'auth/operation-not-allowed');
const FIREBASE_AUTH_INVALID_CREDENTIAL = errorDetail('FA48', 'auth/invalid-credential');
const FIREBASE_AUTH_PHONE_NUMBER_ALREADY_EXISTS = errorDetail('FA49', 'auth/phone-number-already-exists');
const FIREBASE_AUTH_PROJECT_NOT_FOUND = errorDetail('FA50', 'auth/project-not-found');
const FIREBASE_AUTH_INSUFFICIENT_PERMISSION = errorDetail('FA51', 'auth/insufficient-permission');
const FIREBASE_AUTH_INTERNAL_ERROR = errorDetail('FA52', 'auth/internal-error');

export function getFirebaseAuthErrorDetail(code: FirebaseAuthErrorCode): ErrorDetail {
  return code === 'auth/claims-too-large'
    ? FIREBASE_AUTH_CLAIMS_TOO_LARGE
    : code === 'auth/id-token-expired'
    ? FIREBASE_AUTH_ID_TOKEN_EXPIRED
    : code === 'auth/id-token-revoked'
    ? FIREBASE_AUTH_ID_TOKEN_REVOKED
    : code === 'auth/invalid-argument'
    ? FIREBASE_AUTH_INVALID_ARGUMENT
    : code === 'auth/invalid-claims'
    ? FIREBASE_AUTH_INVALID_CLAIMS
    : code === 'auth/invalid-continue-uri'
    ? FIREBASE_AUTH_INVALID_CONTINUE_URI
    : code === 'auth/invalid-creation-time'
    ? FIREBASE_AUTH_INVALID_CREATION_TIME
    : code === 'auth/invalid-disabled-field'
    ? FIREBASE_AUTH_INVALID_DISABLED_FIELD
    : code === 'auth/invalid-display-name'
    ? FIREBASE_AUTH_INVALID_DISPLAY_NAME
    : code === 'auth/invalid-dynamic-link-domain'
    ? FIREBASE_AUTH_INVALID_DYNAMIC_LINK_DOMAIN
    : code === 'auth/invalid-email-verified'
    ? FIREBASE_AUTH_INVALID_EMAIL_VERIFIED
    : code === 'auth/invalid-email'
    ? FIREBASE_AUTH_INVALID_EMAIL
    : code === 'auth/invalid-hash-algorithm'
    ? FIREBASE_AUTH_INVALID_HASH_ALGORITHM
    : code === 'auth/invalid-hash-block-size'
    ? FIREBASE_AUTH_INVALID_HASH_BLOCK_SIZE
    : code === 'auth/invalid-hash-derived-key-length'
    ? FIREBASE_AUTH_INVALID_HASH_DERIVED_KEY_LENGTH
    : code === 'auth/invalid-hash-key'
    ? FIREBASE_AUTH_INVALID_HASH_KEY
    : code === 'auth/invalid-hash-memory-cost'
    ? FIREBASE_AUTH_INVALID_HASH_MEMORY_COST
    : code === 'auth/invalid-hash-parallelization'
    ? FIREBASE_AUTH_INVALID_HASH_PARALLELIZATION
    : code === 'auth/invalid-hash-rounds'
    ? FIREBASE_AUTH_INVALID_HASH_ROUNDS
    : code === 'auth/invalid-hash-salt-separator'
    ? FIREBASE_AUTH_INVALID_HASH_SALT_SEPARATOR
    : code === 'auth/invalid-id-token'
    ? FIREBASE_AUTH_INVALID_ID_TOKEN
    : code === 'auth/invalid-last-sign-in-time'
    ? FIREBASE_AUTH_INVALID_LAST_SIGN_IN_TIME
    : code === 'auth/invalid-page-token'
    ? FIREBASE_AUTH_INVALID_PAGE_TOKEN
    : code === 'auth/invalid-password'
    ? FIREBASE_AUTH_INVALID_PASSWORD
    : code === 'auth/invalid-password-hash'
    ? FIREBASE_AUTH_INVALID_PASSWORD_HASH
    : code === 'auth/invalid-password-salt'
    ? FIREBASE_AUTH_INVALID_PASSWORD_SALT
    : code === 'auth/invalid-phone-number'
    ? FIREBASE_AUTH_INVALID_PHONE_NUMBER
    : code === 'auth/invalid-photo-url'
    ? FIREBASE_AUTH_INVALID_PHOTO_URL
    : code === 'auth/invalid-provider-data'
    ? FIREBASE_AUTH_INVALID_PROVIDER_DATA
    : code === 'auth/invalid-provider-id	'
    ? FIREBASE_AUTH_INVALID_PROVIDER_ID
    : code === 'auth/invalid-session-cookie-duration'
    ? FIREBASE_AUTH_INVALID_SESSION_COOKIE_DURATION
    : code === 'auth/invalid-uid'
    ? FIREBASE_AUTH_INVALID_UID
    : code === 'auth/invalid-user-import'
    ? FIREBASE_AUTH_INVALID_USER_IMPORT
    : code === 'auth/maximum-user-count-exceeded'
    ? FIREBASE_AUTH_MAXIMUM_USER_COUNT_EXCEEDED
    : code === 'auth/missing-android-pkg-name'
    ? FIREBASE_AUTH_MISSING_ANDROID_PKG_NAME
    : code === 'auth/missing-continue-uri'
    ? FIREBASE_AUTH_MISSING_CONTINUE_URI
    : code === 'auth/missing-hash-algorithm'
    ? FIREBASE_AUTH_MISSING_HASH_ALGORITHM
    : code === 'auth/missing-ios-bundle-id'
    ? FIREBASE_AUTH_MISSING_IOS_BUNDLE_ID
    : code === 'auth/missing-uid'
    ? FIREBASE_AUTH_MISSING_UID
    : code === 'auth/reserved-claims'
    ? FIREBASE_AUTH_RESERVED_CLAIMS
    : code === 'auth/session-cookie-expired'
    ? FIREBASE_AUTH_SESSION_COOKIE_EXPIRED
    : code === 'auth/session-cookie-revoked'
    ? FIREBASE_AUTH_SESSION_COOKIE_REVOKED
    : code === 'auth/uid-already-exists'
    ? FIREBASE_AUTH_UID_ALREADY_EXISTS
    : code === 'auth/unauthorized-continue-uri'
    ? FIREBASE_AUTH_UNAUTHORIZED_CONTINUE_URI
    : code === 'auth/email-already-exists'
    ? FIREBASE_AUTH_EMAIL_ALREADY_EXISTS
    : code === 'auth/user-not-found'
    ? FIREBASE_AUTH_USER_NOT_FOUND
    : code === 'auth/operation-not-allowed'
    ? FIREBASE_AUTH_OPERATION_NOT_ALLOWED
    : code === 'auth/invalid-credential'
    ? FIREBASE_AUTH_INVALID_CREDENTIAL
    : code === 'auth/phone-number-already-exists'
    ? FIREBASE_AUTH_PHONE_NUMBER_ALREADY_EXISTS
    : code === 'auth/project-not-found'
    ? FIREBASE_AUTH_PROJECT_NOT_FOUND
    : code === 'auth/insufficient-permission'
    ? FIREBASE_AUTH_INSUFFICIENT_PERMISSION
    : code === 'auth/internal-error'
    ? FIREBASE_AUTH_INTERNAL_ERROR
    : INTERNAL_UNKNOWN;
}

//
// Firebase storage error codes
// @see https://firebase.google.com/docs/storage/web/handle-errors
//

type FirebaseStorageErrorCode =
  | 'storage/unknown'
  | 'storage/object-not-found'
  | 'storage/bucket-not-found'
  | 'storage/project-not-found'
  | 'storage/quota-exceeded'
  | 'storage/unauthenticated'
  | 'storage/unauthorized'
  | 'storage/retry-limit-exceeded'
  | 'storage/invalid-checksum'
  | 'storage/canceled'
  | 'storage/invalid-event-name'
  | 'storage/invalid-url'
  | 'storage/invalid-argument'
  | 'storage/no-default-bucket'
  | 'storage/cannot-slice-blob'
  | 'storage/server-file-wrong-size';

const FIREBASE_STORAGE_UNKNOWN = errorDetail('ST01', 'storage/unknown');
const FIREBASE_STORAGE_OBJECT_NOT_FOUND = errorDetail('ST02', 'storage/object-not-found');
const FIREBASE_STORAGE_BUCKET_NOT_FOUND = errorDetail('ST03', 'storage/bucket-not-found');
const FIREBASE_STORAGE_PROJECT_NOT_FOUND = errorDetail('ST04', 'storage/project-not-found');
const FIREBASE_STORAGE_QUOTA_EXCEEDED = errorDetail('ST05', 'storage/quota-exceeded');
const FIREBASE_STORAGE_UNAUTHENTICATED = errorDetail('ST06', 'storage/unauthenticated');
const FIREBASE_STORAGE_UNAUTHORIZED = errorDetail('ST07', 'storage/unauthorized');
const FIREBASE_STORAGE_RETRY_LIMIT_EXCEEDED = errorDetail('ST08', 'storage/retry-limit-exceeded');
const FIREBASE_STORAGE_INVALID_CHECKSUM = errorDetail('ST09', 'storage/invalid-checksum');
const FIREBASE_STORAGE_CANCELED = errorDetail('ST010', 'storage/canceled');
const FIREBASE_STORAGE_INVALID_EVENT_NAME = errorDetail('ST011', 'storage/invalid-event-name');
const FIREBASE_STORAGE_INVALID_URL = errorDetail('ST012', 'storage/invalid-url');
const FIREBASE_STORAGE_INVALID_ARGUMENT = errorDetail('ST013', 'storage/invalid-argument');
const FIREBASE_STORAGE_NO_DEFAULT_BUCKET = errorDetail('ST014', 'storage/no-default-bucket');
const FIREBASE_STORAGE_CANNOT_SLICE_BLOB = errorDetail('ST015', 'storage/cannot-slice-blob');
const FIREBASE_STORAGE_SERVER_FILE_WRONG_SIZE = errorDetail('ST016', 'storage/server-file-wrong-size');

export function getFirebaseStorageErrorDetail(code: FirebaseStorageErrorCode): ErrorDetail {
  return code === 'storage/unknown'
    ? FIREBASE_STORAGE_UNKNOWN
    : code === 'storage/object-not-found'
    ? FIREBASE_STORAGE_OBJECT_NOT_FOUND
    : code === 'storage/bucket-not-found'
    ? FIREBASE_STORAGE_BUCKET_NOT_FOUND
    : code === 'storage/project-not-found'
    ? FIREBASE_STORAGE_PROJECT_NOT_FOUND
    : code === 'storage/quota-exceeded'
    ? FIREBASE_STORAGE_QUOTA_EXCEEDED
    : code === 'storage/unauthenticated'
    ? FIREBASE_STORAGE_UNAUTHENTICATED
    : code === 'storage/unauthorized'
    ? FIREBASE_STORAGE_UNAUTHORIZED
    : code === 'storage/retry-limit-exceeded'
    ? FIREBASE_STORAGE_RETRY_LIMIT_EXCEEDED
    : code === 'storage/invalid-checksum'
    ? FIREBASE_STORAGE_INVALID_CHECKSUM
    : code === 'storage/canceled'
    ? FIREBASE_STORAGE_CANCELED
    : code === 'storage/invalid-event-name'
    ? FIREBASE_STORAGE_INVALID_EVENT_NAME
    : code === 'storage/invalid-url'
    ? FIREBASE_STORAGE_INVALID_URL
    : code === 'storage/invalid-argument'
    ? FIREBASE_STORAGE_INVALID_ARGUMENT
    : code === 'storage/no-default-bucket'
    ? FIREBASE_STORAGE_NO_DEFAULT_BUCKET
    : code === 'storage/cannot-slice-blob'
    ? FIREBASE_STORAGE_CANNOT_SLICE_BLOB
    : code === 'storage/server-file-wrong-size'
    ? FIREBASE_STORAGE_SERVER_FILE_WRONG_SIZE
    : INTERNAL_UNKNOWN;
}

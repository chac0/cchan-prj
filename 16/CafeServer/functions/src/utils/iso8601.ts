import * as moment from 'moment';

export const ISO8601_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const UTC_OFFSET = '+09:00';

export type ISO8601 = string;

export class Iso8601 {
  public static now(): ISO8601 {
    return moment()
      .utcOffset('+09:00')
      .format(ISO8601_FORMAT);
  }

  public static fromUnixSeconds(unixSeconds: number): ISO8601 {
    return moment
      .unix(unixSeconds)
      .utcOffset('+09:00')
      .format(ISO8601_FORMAT);
  }

  public static fromUnixMillis(unixMillis: number): ISO8601 {
    return moment(unixMillis)
      .utcOffset('+09:00')
      .format(ISO8601_FORMAT);
  }
}

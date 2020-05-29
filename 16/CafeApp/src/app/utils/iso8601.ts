import * as moment from 'moment';

export class Iso8601 {
  static now(): string {
    return moment()
      .utcOffset('+09:00')
      .format();
  }

  static fromUnix(timestamp: number): string {
    return moment
      .unix(timestamp)
      .utcOffset('+09:00')
      .format();
  }

  static fromString(dateString: string) {
    return moment(dateString)
  }
}

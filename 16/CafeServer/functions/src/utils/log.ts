const isTestMode: boolean = process.env.NODE_ENV === 'test';

// tslint:disable: no-console
export class Log {
  public static info(message: string | (() => string), noConsole: boolean = true) {
    if (isTestMode && noConsole) return;

    const m = this.getMessage(message);
    console.log(m);
  }

  public static debug(message: string | (() => string), noConsole: boolean = true) {
    if (isTestMode && noConsole) return;

    const m = this.getMessage(message);
    console.log(m);
  }

  public static warn(message: string | (() => string), noConsole: boolean = true) {
    if (isTestMode && noConsole) return;

    const m = this.getMessage(message);
    console.warn(m);
  }

  public static error(message: string | (() => string), noConsole: boolean = true) {
    if (isTestMode && noConsole) return;

    const m = this.getMessage(message);
    console.error(m);
  }

  private static getMessage(message: string | (() => string)): string {
    return typeof message === 'function' ? message() : message;
  }
}
// tslint:enable: no-console

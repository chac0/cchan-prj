import { Iso8601 } from '../utils/iso8601';

export class LoginDocument {
    static none = new LoginDocument();

    id: string;
    loginMail: string;
    password: string;

    constructor(source: Partial<LoginDocument> = {}) {
      this.id = source.id || '';
      this.loginMail = source.loginMail || '';
      this.password = source.password || '';
    }
  }

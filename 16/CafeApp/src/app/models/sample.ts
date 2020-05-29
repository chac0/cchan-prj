import { Iso8601 } from '../utils/iso8601';

export class SampleDocument {
    static none = new SampleDocument();
  
    id: string;
    name: string;
    price: number;
    birthDay: string;
    createdAt: Iso8601;

    constructor(source: Partial<SampleDocument> = {}) {
      this.id = source.id || '';
      this.name = source.name || '';
      this.price = source.price || 0;
      this.birthDay = source.birthDay || '';
      this.createdAt = source.createdAt || '';
    }
  }

import { ISO8601 } from '../utils/iso8601';

export interface Sample {
  id?: string;
  name?: string;
  price: number;
  birthDay?: string;
  createdAt?: ISO8601;
}

export class SampleRequest{
  id: string;

  constructor(source: Partial<SampleRequest> = {}) {
    this.id = source.id || '';
  }

}
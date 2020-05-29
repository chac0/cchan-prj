export interface Runnable {
  run(data: any, accessUserId?: string): Promise<any>;
}

export interface RunnableSample {
  run(data: any): Promise<any>;
}

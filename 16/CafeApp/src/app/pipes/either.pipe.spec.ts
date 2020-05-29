import { EitherPipe } from './either.pipe';

describe('EitherPipe', () => {
  it('create an instance', () => {
    const pipe = new EitherPipe();
    expect(pipe).toBeTruthy();
  });

  it('第一引数がTrueの時、第三引数の値を返しているか', () => {
    const pipe = new EitherPipe();
    expect(pipe.transform(true, 'Left', 'Right')).toEqual('Right')
  });

  it('第一引数がFalseの時、第二引数の値を返しているか', () => {
    const pipe = new EitherPipe();
    expect(pipe.transform(false, 'Left', 'Right')).toEqual('Left')
  });
});

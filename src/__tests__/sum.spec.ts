import { sum } from '@src/Math/sum';
import { concat } from '@src/Math/concat';

describe('Testing sum', () => {
  it('return sum of 1, 4 to be 5', () => {
    const result = sum(1, 4);
    expect(result).toBe(5);
  });
  it('return value type of function sum must be an Integer', () => {
    const result = sum(1, 4);
    expect(Number.isInteger(result)).toBeTruthy();
  });
});
describe('Testing concat', () => {
  it('return value type of function concat must be an string', () => {
    const result = concat('Hello', 'World!!!!');
    expect(typeof result === 'string').toBeTruthy();
  });
});

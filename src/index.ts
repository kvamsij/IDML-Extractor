import { sum } from '@src/Math/sum';
import { concat } from '@src/Math/concat';

(() => {
  const result = sum(1, 4);
  const stringConcat = concat('string1', 'string2');
  return { result, stringConcat };
})();

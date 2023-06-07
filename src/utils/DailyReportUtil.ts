import _ from 'lodash';

export function aggregate(summable: number[]) {
  return _.reduce(
    summable,
    function (sum: number, n: number) {
      return sum + n;
    },
    0
  );
}

export const DD_MM_YYYY_FORMAT = 'DD-MMM-YYYY'

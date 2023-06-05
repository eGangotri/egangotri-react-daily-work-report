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

export const BASIC_ROLE = "Basic";
export const ADMIN_ROLE = "Admin";
export const SUPER_ADMIN_ROLE = "SuperAdmin";
/* @flow */

import { parseQuery, stringifyQuery } from './util';

const search =
  'involved.role=Victim+%28Violence+and+Agression%29&pressureUlcer.location=ward&involved.type=Employee%2FMember+of+staff';

const query = {
  'involved.role': 'Victim (Violence and Agression)',
  'pressureUlcer.location': 'ward',
  'involved.type': 'Employee/Member of staff',
};

describe('location util', () => {
  it('parses without changing order', () => {
    const parsed = parseQuery(search);
    expect(parsed).toEqual(query);
    const keys = Object.keys(parsed);
    expect(keys).toEqual([
      'involved.role',
      'pressureUlcer.location',
      'involved.type',
    ]);
  });

  it('stringifies without changing order', () => {
    const stringified = stringifyQuery(query);
    expect(stringified).toEqual(search);
  });
});

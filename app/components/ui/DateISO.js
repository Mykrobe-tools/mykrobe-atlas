/* @flow */

import * as React from 'react';

import { formatDate } from 'makeandship-js-common/src/utils/date';

import styles from './DateISO.module.scss';

const DateISO = ({ date }: React.ElementProps<*>): React.Element<*> => {
  const formatted = React.useMemo(() => {
    if (date !== undefined) {
      const dateParsed = new Date(date);
      if (dateParsed) {
        return formatDate(dateParsed);
      }
    }
    return '–';
  }, [date]);
  return (
    <span data-value={date} className={styles.date}>
      {formatted}
    </span>
  );
};

export default DateISO;

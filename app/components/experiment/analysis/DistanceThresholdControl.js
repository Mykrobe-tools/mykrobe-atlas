/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  selectors as experimentSettingsSelectors,
  actions as experimentSettingsActions,
} from '../../../modules/experiments/experimentSettings';

const DistanceThresholdControl = () => {
  const dispatch = useDispatch();
  const distanceThreshold = useSelector(
    experimentSettingsSelectors.getDistanceThreshold
  );
  const options = React.useMemo(() => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(i);
    }
    return options;
  }, []);
  return (
    <UncontrolledDropdown>
      <DropdownToggle color="mid" outline size={'sm'}>
        Max distance {distanceThreshold} <i className="fa fa-caret-down" />
      </DropdownToggle>
      <DropdownMenu>
        {options.map((option) => {
          const selected = distanceThreshold == option;
          return (
            <DropdownItem
              key={option}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  experimentSettingsActions.setDistanceThreshold(option)
                );
              }}
            >
              {option} {selected && <i className="fa fa-check-square" />}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default DistanceThresholdControl;

/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';
import Table, { TdLink } from 'makeandship-js-common/src/components/ui/table';

import OrganisationStatusIcon from '../organisation/ui/OrganisationStatusIcon';

import HeaderContainer from '../ui/header/HeaderContainer';
import Footer from '../ui/footer/Footer';
import { withCurrentUserPropTypes } from '../../hoc/withCurrentUser';

import styles from './Organisations.scss';

const headings = [
  {
    title: 'Name',
    sort: 'name',
  },
  {
    title: 'Template',
    sort: 'template',
  },
  {
    title: 'Members',
    sort: 'members',
  },
  {
    title: 'Your status',
  },
  {
    title: '',
  },
];

class Organisations extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisations } = this.props;
    requestOrganisations && requestOrganisations();
  }

  onNewOrganisation = (e: any) => {
    e && e.preventDefault();
    const { newOrganisation } = this.props;
    newOrganisation();
  };

  onChangeListOrder = ({ sort, order }: any) => {
    const { setOrganisationsFilters, organisationsFilters } = this.props;
    setOrganisationsFilters({
      ...organisationsFilters,
      order,
      sort,
      page: undefined,
    });
  };

  renderRow = (organisation: any) => {
    const {
      id,
      name,
      template,
      currentUserStatus,
      members,
      owners,
    } = organisation;
    return (
      <TdLink key={id} to={`/organisations/${id}`}>
        <td>{name}</td>
        <td>{template}</td>
        <td>{members.length + owners.length}</td>
        <td>
          <OrganisationStatusIcon status={currentUserStatus} />{' '}
          {currentUserStatus || '–'}
        </td>
        <td>
          <UncontrolledDropdown>
            <DropdownToggle
              tag={'a'}
              href="#"
              className={styles.dropdownToggle}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <i className="fa fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem tag={Link} to={`/organisations/${id}`}>
                <i className="fa fa-chevron-circle-right" /> View
              </DropdownItem>
              <DropdownItem tag={Link} to={`/organisations/${id}/edit`}>
                <i className="fa fa-pencil" /> Edit
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </TdLink>
    );
  };

  render() {
    const {
      organisationsWithCurrentUserStatus,
      organisationsFilters,
    } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Organisations'} />
        <div className={styles.container}>
          <Container fluid>
            <PageHeader border={false}>
              <div className={pageHeaderStyles.title}>Organisations</div>
              <div>
                <PrimaryButton
                  onClick={this.onNewOrganisation}
                  outline
                  size="sm"
                  icon="plus-circle"
                  marginLeft
                >
                  New Organisation
                </PrimaryButton>
              </div>
            </PageHeader>
            <Table
              headings={headings}
              data={organisationsWithCurrentUserStatus}
              sort={organisationsFilters.sort || 'id'}
              order={organisationsFilters.order || Table.Order.Descending}
              renderRow={this.renderRow}
              onChangeOrder={this.onChangeListOrder}
            />
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

Organisations.propTypes = {
  ...withCurrentUserPropTypes,
  organisations: PropTypes.array,
  organisationsWithCurrentUserStatus: PropTypes.array,
  requestOrganisations: PropTypes.func,
  newOrganisation: PropTypes.func,
  isFetching: PropTypes.bool,
  organisationsFilters: PropTypes.any,
  setOrganisationsFilters: PropTypes.func,
};

export default Organisations;

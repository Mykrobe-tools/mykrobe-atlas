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

import OrganisationStatusIcon from '../../organisation/ui/OrganisationStatusIcon';
import HeaderContainer from '../../ui/header/HeaderContainer';
import Footer from '../../ui/footer/Footer';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';
import { notImplemented } from '../../../util';

import styles from './OrganisationMembers.scss';

const headings = [
  {
    title: 'Email',
  },
  {
    title: 'Last name',
  },
  {
    title: 'First name',
  },
  {
    title: 'Status',
  },
  {
    title: '',
  },
];

class OrganisationMembers extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  onNewMember = (e: any) => {
    e && e.preventDefault();
    notImplemented();
  };

  onChangeListOrder = ({ sort, order }: any) => {
    notImplemented();
  };

  renderRow = (member: any) => {
    const { id, firstname, lastname, email, organisationUserStatus } = member;
    return (
      <TdLink key={id} to={`mailto:${email}`}>
        <td>{email}</td>
        <td>{lastname}</td>
        <td>{firstname}</td>
        <td>
          <OrganisationStatusIcon status={organisationUserStatus} />{' '}
          {organisationUserStatus || '–'}
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
    const { organisationMembers } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Organisations'} />
        <div className={styles.container}>
          <Container fluid>
            <PageHeader border={false}>
              <div className={pageHeaderStyles.title}>Members</div>
              <div>
                <PrimaryButton
                  onClick={this.onNewMember}
                  outline
                  size="sm"
                  icon="plus-circle"
                  marginLeft
                >
                  New Member
                </PrimaryButton>
              </div>
            </PageHeader>
            <Table
              headings={headings}
              data={organisationMembers}
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

OrganisationMembers.propTypes = {
  ...withOrganisationPropTypes,
};

export default OrganisationMembers;

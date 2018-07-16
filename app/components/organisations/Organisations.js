/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'reactstrap';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';
import { Table } from 'makeandship-js-common/src/components/ui/table';

import {
  getOrganisations,
  getOrganisationIsFetching,
  requestOrganisations,
  newOrganisation,
  getOrganisationsFilters,
  setOrganisationsFilters,
} from '../../modules/organisations';

import styles from './Common.scss';
import Header from '../header/Header';

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
    title: '',
  },
];

class Profile extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisations } = this.props;
    requestOrganisations();
  }

  onNewOrganisation = e => {
    e && e.preventDefault();
    const { newOrganisation } = this.props;
    newOrganisation();
  };

  onOrganisationClick = organisation => {
    const { push } = this.props;
    const { id } = organisation;
    push(`/organisations/${id}`);
  };

  onChangeListOrder = ({ sort, order }) => {
    const { setOrganisationsFilters, organisationsFilters } = this.props;
    setOrganisationsFilters({
      ...organisationsFilters,
      order,
      sort,
      page: undefined,
    });
  };

  renderRow = (organisation: any) => {
    const { id, name, template } = organisation;
    return (
      <tr key={id} onClick={() => this.onOrganisationClick(organisation)}>
        <td>{name}</td>
        <td>{template}</td>
        <td />
      </tr>
    );
  };

  render() {
    const { organisations, organisationsFilters } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Organisations'} />
        <Container fluid>
          <PageHeader border={false}>
            <div>
              <div className={pageHeaderStyles.title}>Organisations</div>
            </div>
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
            data={organisations}
            sort={organisationsFilters.sort || 'id'}
            order={organisationsFilters.order || Table.Order.Descending}
            renderRow={this.renderRow}
            onChangeOrder={this.onChangeListOrder}
          />
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organisations: getOrganisations(state),
    isFetching: getOrganisationIsFetching(state),
    organisationsFilters: getOrganisationsFilters(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestOrganisations,
      newOrganisation,
      setOrganisationsFilters,
      push,
    },
    dispatch
  );
}

Profile.propTypes = {
  organisations: PropTypes.array.isRequired,
  requestOrganisations: PropTypes.func.isRequired,
  newOrganisation: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  organisationsFilters: PropTypes.any,
  setOrganisationsFilters: PropTypes.func,
  push: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

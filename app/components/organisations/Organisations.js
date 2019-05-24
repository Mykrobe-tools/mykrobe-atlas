/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'reactstrap';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';
import Table, { TdLink } from 'makeandship-js-common/src/components/ui/table';

import {
  getOrganisations,
  getOrganisationIsFetching,
  requestOrganisations,
  newOrganisation,
  getOrganisationsFilters,
  setOrganisationsFilters,
} from '../../modules/organisations';

import HeaderContainer from '../header/HeaderContainer';
import Footer from '../footer/Footer';

import styles from './Common.scss';

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
      <TdLink key={id} to={`/organisations/${id}`}>
        <td>{name}</td>
        <td>{template}</td>
        <td />
      </TdLink>
    );
  };

  render() {
    const { organisations, organisationsFilters } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Organisations'} />
        <div className={styles.container}>
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
        <Footer />
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

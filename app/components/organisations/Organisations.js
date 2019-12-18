/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';
import Table, { TdLink } from 'makeandship-js-common/src/components/ui/table';

import HeaderContainer from '../ui/header/HeaderContainer';
import Footer from '../ui/footer/Footer';

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

class Organisations extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisations } = this.props;
    requestOrganisations();
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

Organisations.propTypes = {
  organisations: PropTypes.array,
  requestOrganisations: PropTypes.func,
  newOrganisation: PropTypes.func,
  isFetching: PropTypes.bool,
  organisationsFilters: PropTypes.any,
  setOrganisationsFilters: PropTypes.func,
};

export default Organisations;

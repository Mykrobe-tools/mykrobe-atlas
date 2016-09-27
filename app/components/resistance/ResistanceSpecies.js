import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceSpecies.css';

import * as AnalyserActions from 'actions/AnalyserActions';
import MykrobeConfig from 'api/MykrobeConfig';
import * as TargetConstants from 'constants/TargetConstants';

// TODO: move config into global props

class ResistanceSpecies extends Component {
  render() {
    const {analyser} = this.props;
    if ( !analyser.transformed ) {
      return null;
    }
    const config = new MykrobeConfig();
    const {resistant, lineage, species} = analyser.transformed;

    let drugsResistanceModel = {
        mdr:false,
        xdr:false
    };

    if ( resistant.indexOf('Isoniazid') !== -1 && resistant.indexOf('Rifampicin') !== -1 ) {
        drugsResistanceModel.mdr = true;
        /*
        If MDR AND R to both fluoroquinolones and one of the other these 3 (Amikacin, Kanamycin, Capreomycin), then call it XDR (Extensively Drug Resistant)
        */
        if ( resistant.indexOf('Quinolones') ) {
            if ( resistant.indexOf('Amikacin') !== -1 || resistant.indexOf('Kanamycin') !== -1 || resistant.indexOf('Capreomycin') !== -1 ) {
                drugsResistanceModel.xdr = true;
            }
        }
    }

    let speciesModel = '';

    if ( TargetConstants.SPECIES_TB === config.species ) {
        speciesModel = species.join(' / ') +' (lineage: '+lineage[0]+')';
    }
    else {
        speciesModel = species.join(' / ');
    }

    return (
      <div>
        {speciesModel}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceSpecies.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceSpecies);

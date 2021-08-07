/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import ConnectedStorybook from '../../../util/storybook/ConnectedStorybook';

import EditMetadata from './EditMetadata';
import { requestExperiment } from '../../../modules/experiments';

import store from '../../../store';

import { filteredSchemaWithSubsections } from '../../../schemas/experiment';

const patientSchema = filteredSchemaWithSubsections(['patient']);
const sampleSchema = filteredSchemaWithSubsections(['sample']);
const genotypingSchema = filteredSchemaWithSubsections(['genotyping']);

// TODO: generic flag to override form 'readonly' status

store.dispatch(requestExperiment('5b55e8c0c23a300010bac216'));

storiesOf('Experiment/EditMetadata', module)
  .addDecorator((story) => (
    <MemoryRouter
      initialEntries={[
        '/experiments/5b55e8c0c23a300010bac216/metadata/patient',
      ]}
    >
      {story()}
    </MemoryRouter>
  ))
  .addDecorator((story) => <ConnectedStorybook story={story()} />)
  .add('Patient', () => <EditMetadata schema={patientSchema} />)
  .add('Sample', () => <EditMetadata schema={sampleSchema} />)
  .add('Genotyping', () => <EditMetadata schema={genotypingSchema} />);

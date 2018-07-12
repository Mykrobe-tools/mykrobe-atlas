/* @flow */

export default (json: Object) => {
  const testData = require('../__fixtures__/experiment.json').data;
  if (!json.location) {
    json.location = testData.location;
  }
  if (!json.geoDistance) {
    json.geoDistance = testData.geoDistance;
  }
  if (json.geoDistance.experiments.length === 0) {
    json.geoDistance.experiments = testData.geoDistance.experiments;
  }
  if (!json.snpDistance) {
    json.snpDistance = testData.snpDistance;
  }
  if (!json.snpDistance.newick) {
    json.snpDistance.newick = testData.snpDistance.newick;
  }
  return json;
};

/* @flow */

import speciesTransformer from './speciesTransformer';

describe('speciesTransformer', () => {
  describe('when valid', () => {
    describe('and single lineage', () => {
      it('should include lineage', async () => {
        const { speciesAndLineageString } = speciesTransformer({
          phylogenetics: {
            species: {
              Foo_bar: {},
            },
            lineage: {
              Baz: {},
            },
          },
        });
        expect(speciesAndLineageString).toEqual('Foo bar (Baz)');
      });
    });
    describe('and mixed lineages', () => {
      it('should include lineages', async () => {
        const { speciesAndLineageString } = speciesTransformer({
          phylogenetics: {
            species: {
              Foo_bar: {},
            },
            lineage: {
              Baz: {},
              Qux: {},
            },
          },
        });
        expect(speciesAndLineageString).toEqual('Foo bar (mixed Baz, Qux)');
      });
    });
    describe('and single lineage is Unknown', () => {
      it('should not include lineage', async () => {
        const { speciesAndLineageString } = speciesTransformer({
          phylogenetics: {
            species: {
              Foo_bar: {},
            },
            lineage: {
              Unknown: {},
            },
          },
        });
        expect(speciesAndLineageString).toEqual('Foo bar');
      });
    });
    describe('and mixed lineages include Unknown', () => {
      it('should not include Unknown lineage', async () => {
        const { speciesAndLineageString } = speciesTransformer({
          phylogenetics: {
            species: {
              Foo_bar: {},
            },
            lineage: {
              Unknown: {},
              Baz: {},
              Qux: {},
            },
          },
        });
        expect(speciesAndLineageString).toEqual('Foo bar (mixed Baz, Qux)');
      });
    });
  });
});

import { expect, sinon } from '../test-helper';
import { Config } from '../../src/index';
import { Author } from '../fixtures';

describe('#setup()', function() {
  it('can be called without options', function() {
    let setup = function() {
      Config.setup();
    }
    expect(setup).to.not.throw();
  });
});

describe('#modelForType', function() {
  it('returns the relevant class for jsonapiType', function() {
    expect(Config.modelForType('authors')).to.eq(Author);
  });

  describe('when no corresponding class found', function() {
    it('throws an error', function() {
      let fn = function() { Config.modelForType('asdf') };
      expect(fn).to.throw(/Could not find class for jsonapi type "asdf"/);
    });
  });
});

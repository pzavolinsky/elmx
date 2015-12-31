const parse = require('../dist/expression').parse;

describe('expression', () => {

  parsesA(' \t\n\r ', 'whitespace');
  parsesA('', 'whitespace');
  parsesA('text', 'text');
  parsesA('{code}', 'code', 'code');
  parsesA('{=text}', 'textExpr', 'text');
  parsesA('{:code}', 'list', 'code');
  parsesA('    text', 'text', '    text');

  parses('   {code}', [ { whitespace: '   ' }, { code: 'code' } ]);
  parses('{code}   ', [ { code: 'code' }, { whitespace: '   ' } ]);

  // Helpers

  function parsesA(what, key, expected) {
    parses(what, [{ [key]: expected || what }]);
  }

  function parses(what, expected) {
    it(`parses ${JSON.stringify(what)} as ${JSON.stringify(expected)}`, () => {
      expect(
        parse(what)
      ).toEqual(
        expected
      );
    });
  }
});

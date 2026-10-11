import path from 'node:path';

import ts from 'typescript';

const paramsPath = path.resolve(import.meta.dirname, '../bundle/params.ts');

// Check both union ordering modes with and without strict null checking.
const scenarios = [false, true].flatMap((strictNullChecks) =>
  [false, true].map((stableTypeOrdering) => ({ stableTypeOrdering, strictNullChecks })),
);

describe('buildClientParams types', () => {
  it.each(scenarios)(
    'compiles with strictNullChecks=$strictNullChecks and stableTypeOrdering=$stableTypeOrdering',
    ({ stableTypeOrdering, strictNullChecks }) => {
      const program = ts.createProgram([paramsPath], {
        lib: ['lib.es2022.d.ts'],
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        noImplicitAny: true,
        skipLibCheck: true,
        stableTypeOrdering,
        strictNullChecks,
        target: ts.ScriptTarget.ES2022,
        types: [],
      });
      const diagnostics = ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
        code: diagnostic.code,
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      }));

      expect(diagnostics).toEqual([]);
    },
  );
});

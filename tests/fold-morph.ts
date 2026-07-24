import { Project, SyntaxKind } from 'ts-morph'
import { FOLDS } from './fold-constants.js'

const FILE_PATHS = [
  'tests/by-struct/bigint.test.ts',
  'tests/by-struct/boolean.test.ts',
  'tests/by-struct/literal.test.ts',
  'tests/by-struct/number.test.ts',
  'tests/by-struct/string.test.ts',
  //
  'tests/by-struct/array.test.ts',
  'tests/by-struct/object.test.ts',
  'tests/by-struct/record.test.ts',
  'tests/by-struct/tuple.test.ts',
  'tests/by-struct/union.test.ts',
]

// union() reports ERROR_CODE.invalidUnion (not invalidType) when no branch
// matches, so its foldC/foldE blocks diverge from the shared template on
// that one value and are hand-maintained instead of generated.
const SKIP_LABELS: Partial<Record<string, string[]>> = {
  'tests/by-struct/union.test.ts': ['foldC', 'foldE'],
}

for (const filePath of FILE_PATHS) {
  for (const [foldLabel, foldContent] of FOLDS) {
    if (SKIP_LABELS[filePath]?.includes(foldLabel)) {
      continue
    }

    foldSync({ filePath, foldLabel, foldContent })
  }
}

function foldSync(props: {
  filePath: string
  foldLabel: string
  foldContent: string
}) {
  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(props.filePath)

  const labeledStatements = sourceFile.getDescendantsOfKind(
    SyntaxKind.LabeledStatement
  )

  for (const labeledStatement of labeledStatements) {
    const label = labeledStatement.getLabel()

    if (label.getText() === props.foldLabel) {
      const statement = labeledStatement.getStatement()

      if (statement.getKind() === SyntaxKind.Block) {
        const blockStatement = statement.asKindOrThrow(SyntaxKind.Block)
        blockStatement.replaceWithText(props.foldContent)
      }
    }
  }

  sourceFile.saveSync()
}

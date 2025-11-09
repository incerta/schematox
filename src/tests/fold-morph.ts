import { Project, SyntaxKind } from 'ts-morph'
import { FOLDS } from './fold-constants'

const FILE_PATHS = [
  'src/tests/by-struct/boolean.test.ts',
  'src/tests/by-struct/literal.test.ts',
  'src/tests/by-struct/number.test.ts',
  'src/tests/by-struct/string.test.ts',
  //
  'src/tests/by-struct/array.test.ts',
  'src/tests/by-struct/object.test.ts',
  'src/tests/by-struct/record.test.ts',
  'src/tests/by-struct/tuple.test.ts',
  'src/tests/by-struct/union.test.ts',
]

for (const filePath of FILE_PATHS) {
  for (const [foldLabel, foldContent] of FOLDS) {
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

#!/usr/bin/env node

const fs = require('fs')
const path = require('node:path')
const pc = require('picocolors')
const ts = require('typescript')
const argv = require('yargs-parser')(process.argv.slice(2))
const packageJson = require('./package.json')
const {
  readAndGenerateSchema,
  readAndGenerateType
} = require('.')

const HELP = `
openapi-fastify - command line Fastify schema generator [version ${packageJson.version}]

${pc.bold('USAGE')}
  $ openapi-fastify --input <file> --output <path> [options]

${pc.bold('OPTIONS')}
  --help        help about this command
  --input       OAS file
  --language    code syntax <ts | esm>
  --output      output path
`

const SYNTAX = {
  ESM: 'esm',
  TYPESCRIPT: 'ts'
}

const buildErrorMessage = (error) => `
${pc.cyan('[openapi-fastify]')} ${pc.bgRed('ERROR')} ${error}
`

const main = async () => {
  if (argv.help) {
    return console.info(HELP)
  }

  if (argv.input == null) {
    return console.info(HELP)
  }

  if (argv.output == null) {
    return console.info(HELP)
  }

  const schemaAst = readAndGenerateSchema(argv.input)
  const typeAst = readAndGenerateType(argv.input)

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

  if (argv.language === SYNTAX.ESM) {
    fs.writeFileSync(
      path.join(process.cwd(), argv.output, 'schemas.js'),
      ts.transpile(printer.printFile(schemaAst), { target: ts.ScriptTarget.ESNext })
    )
  } else { // TypeScript
    fs.writeFileSync(
      path.join(process.cwd(), argv.output, 'schemas.ts'),
      printer.printFile(schemaAst)
    )

    fs.writeFileSync(
      path.join(process.cwd(), argv.output, 'interfaces.ts'),
      printer.printFile(typeAst)
    )
  }
}

main()
  .catch(error => console.error(buildErrorMessage(error)))

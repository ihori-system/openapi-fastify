#!/usr/bin/env node

const pc = require('picocolors')
const argv = require('yargs-parser')(process.argv.slice(2))
const packageJson = require('./package.json')

const HELP = `
openapi-fastify - command line Fastify schema generator [version ${packageJson.version}]

${pc.bold('USAGE')}
  $ openapi-fastify --input <file> --output <path> [options]

${pc.bold('OPTIONS')}
  --help      help about this command
  --input     OAS file
  --omit      omit schema or type <schema | type>
  --output    output path
`

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
}

main()
  .catch(error => console.error(buildErrorMessage(error)))

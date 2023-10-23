openapi-fastify
===

Command line tool for Fastify, Generate schemas from OpenAPI JSON.

[![Continuous Integration](https://github.com/ihori-system/openapi-fastify/actions/workflows/ci.yml/badge.svg)](https://github.com/ihori-system/openapi-fastify/actions/workflows/ci.yml)

## Usage

```
npx github:ihori-system/openapi-fastify --input <file> --output <path> [options]
```

## Options

```
USAGE
  $ openapi-fastify --input <file> --output <path> [options]

OPTIONS
  --help        help about this command
  --input       OAS file
  --language    code syntax <ts | esm>
  --output      output path
```

## Examples

| OpenAPI Version | Language | Example |
| ------------- | ------------- | ------------- |
| 3.0.0 | JavaScript (ECMAScript modules) | [petstore-esm](./examples/v3.0/petstore-esm)
| 3.0.0 | TypeScript | [petstore-ts](./examples/v3.0/petstore-ts) |

## Note

- Do not use OpenAPI version 3.1.x. `openapi-fastify` supports 3.1.x but [fast-json-stringify does not](https://github.com/fastify/fast-json-stringify#nullable).

## License

Licensed under MIT.

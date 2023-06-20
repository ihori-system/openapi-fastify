const {
  generateSchema: generateSchemaV30,
  generateType: generateTypeV30
} = require('./v3.0')
const {
  generateSchema: generateSchemaV31,
  generateType: generateTypeV31
} = require('./v3.1')

module.exports = {
  generateSchemaV30,
  generateTypeV30,
  generateSchemaV31,
  generateTypeV31
}

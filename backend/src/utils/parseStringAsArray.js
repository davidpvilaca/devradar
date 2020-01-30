module.exports = function parseStringAsArray (arrayAsString) {
  if (Array.isArray(arrayAsString)) {
    return arrayAsString
  }
  return arrayAsString.split(',').map(tech => tech.trim())
}

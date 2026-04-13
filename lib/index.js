'use strict'

const Store = require('./store')
const base32 = require('./base32')
const { hotp, totp }  = require('./totp')

function keyFromText (string) {
  return base32.decode(string)
}

module.exports = {
  Store,
  keyFromText,
  hotp,
  totp
}

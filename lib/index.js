'use strict'

const Store = require('./store')
const { base32 } = require('@escodb/buffer-codec')
const { hotp, totp }  = require('./totp')

function keyFromText (string) {
  string = string.toUpperCase().replace(/[^A-Z2-7=]/g, '')
  return base32.decode(string)
}

module.exports = {
  Store,
  keyFromText,
  hotp,
  totp
}

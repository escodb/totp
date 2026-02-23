'use strict'

const base32 = require('thirty-two')
const { hotp, totp }  = require('./totp')

function keyFromText (string) {
  string = string.toUpperCase().replace(/[^A-Z2-7=]/g, '')
  return base32.decode(string)
}

module.exports = {
  keyFromText,
  hotp,
  totp
}

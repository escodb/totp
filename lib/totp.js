'use strict'

const crypto = require('crypto')

// TOTP: Time-Based One-Time Password Algorithm
// https://datatracker.ietf.org/doc/html/rfc6238

const DEFAULT_ALGO   = 'sha1'
const DEFAULT_T0     = 0
const DEFAULT_STEP   = 30
const DEFAULT_DIGITS = 6

function totp (key, digits, algo, t0, step) {
  algo = algo || DEFAULT_ALGO
  t0   = t0   || DEFAULT_T0
  step = step || DEFAULT_STEP

  let offset  = (Date.now() / 1000) - t0
  let counter = BigInt(Math.floor(offset / step))

  return hotp(key, counter, digits, algo)
}

// HOTP: An HMAC-Based One-Time Password Algorithm
// https://datatracker.ietf.org/doc/html/rfc4226

function hotp (key, counter, digits = DEFAULT_DIGITS, algo = DEFAULT_ALGO) {
  let buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(counter, 0)

  let hmac = crypto.createHmac(algo, key)
  hmac.update(buf)
  return truncate(hmac.digest(), digits)
}

function truncate (hash, digits) {
  let offset = hash.readUInt8(hash.length - 1) & 0xf
  let hibyte = hash.readUInt8(offset)

  hash.writeUInt8(hibyte & 0x7f, offset)

  let code = hash.readUInt32BE(offset) % (10 ** digits)
  return leftPad(code.toString(10), digits, '0')
}

function leftPad (string, length, pad) {
  let diff = length - string.length
  return Array(diff + 1).join(pad) + string
}

module.exports = { hotp, totp }

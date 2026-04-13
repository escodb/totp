'use strict'

const { Buffer } = require('@escodb/buffer')
const transcode = require('@escodb/buffer/lib/codec/transcode')

const Base32 = {
  encode (buf) {
    let str = Buffer.from(transcode(buf, 8, 5, bitsToChar).buffer)
    return str.toString('utf8')
  },

  decode (str) {
    str = str.replace(/\s/g, '')
    let buf = Buffer.from(str, 'utf8')
    return Buffer.from(transcode(buf, 5, 8, charToBits).buffer)
  }
}

//      input       | char      | code
//      ------------+-----------+-----------
//      00 - 19     | A - Z     | 41 - 5a
//                  | a - z     | 61 - 7a
//      1a - 1f     | 2 - 7     | 32 - 37

function bitsToChar (b) {
  return ~((b - 0x00) | (0x19 - b)) >> 8 & (b + 0x41) // 0x41 - 0x00
       | ~((b - 0x1a) | (0x1f - b)) >> 8 & (b + 0x18) // 0x32 - 0x1a
}

function charToBits (c) {
  return ~((c - 0x41) | (0x5a - c)) >> 8 & (c - 0x41) // 0x00 - 0x41
       | ~((c - 0x61) | (0x7a - c)) >> 8 & (c - 0x61) // 0x00 - 0x61
       | ~((c - 0x32) | (0x37 - c)) >> 8 & (c - 0x18) // 0x1a - 0x32
}

module.exports = Base32

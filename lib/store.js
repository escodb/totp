'use strict'

const escodb = require('@escodb/core')

const KEY_DIR = '/keys/'

class Store {
  static async open (path, password) {
    let adapter = new escodb.FileAdapter({ path })
    let store = new escodb.Store(adapter, { key: { password } })
    let handle = await store.openOrCreate({ shards: { n: 1 } })

    return new Store(handle)
  }

  constructor (db) {
    this._db = db
  }

  async allKeys () {
    let task = this._db.task()
    let names = await task.list(KEY_DIR)

    let codes = names.map(async (name) => {
      let key = await task.get(KEY_DIR + name)
      return { name, key }
    })

    return Promise.all(codes)
  }
}

module.exports = Store

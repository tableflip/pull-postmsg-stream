const pull = require('pull-stream')
const shortid = require('shortid')
const log = require('./log')
const { getRandomInt } = require('./random')
const { sink } = require('../')

log('iframe ready')

const readFnName = `readMe-${shortid()}`
const postMessage = window.parent.postMessage.bind(window.parent)

pull(
  pull.values(Array(getRandomInt(5, 50)).fill(0).map(shortid)),
  pull.asyncMap((data, cb) => {
    const delay = getRandomInt(500, 2000)

    log(`pull requested, responding in ${delay}ms`)

    setTimeout(() => {
      log('responding with', data)
      cb(null, data)
    }, delay)
  }),
  sink(readFnName, { postMessage })
)

log('sending readFnName', readFnName)

window.parent.postMessage({ readFnName }, '*')

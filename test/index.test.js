const test = require('ava')
const shortid = require('shortid')
const pull = require('pull-stream')
const { sink, source } = require('../')
const mockWindow = require('./helpers/mock-window')
const { getRandomInt } = require('./helpers/random')

test.cb('should pull data over postMessage', (t) => {
  const mainWin = mockWindow()
  const iframeWin = mockWindow()

  const readFnName = shortid()
  const data = Array(getRandomInt(100, 500)).fill(0).map(shortid)

  pull(
    pull.values(data),
    sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    source(readFnName, {
      addListener: mainWin.addEventListener,
      removeListener: mainWin.removeEventListener,
      postMessage: iframeWin.postMessage
    }),
    pull.collect((err, pulledData) => {
      t.ifError(err)
      t.deepEqual(pulledData, data)
      t.end()
    })
  )
})

test.cb('should clean up all listeners', (t) => {
  const mainWin = mockWindow()
  const iframeWin = mockWindow()

  const readFnName = shortid()
  const data = Array(getRandomInt(100, 500)).fill(0).map(shortid)

  pull(
    pull.values(data),
    sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    source(readFnName, {
      addListener: mainWin.addEventListener,
      removeListener: mainWin.removeEventListener,
      postMessage: iframeWin.postMessage
    }),
    pull.collect((err) => {
      t.ifError(err)
      t.is(mainWin.listeners.length, 0)
      t.is(iframeWin.listeners.length, 0)
      t.end()
    })
  )
})

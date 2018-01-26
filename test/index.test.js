const test = require('ava')
const shortid = require('shortid')
const pull = require('pull-stream')
const PMS = require('../')
const mockWindow = require('./helpers/mock-window')
const { getRandomInt } = require('./helpers/random')

test.cb('should pull data over postMessage', (t) => {
  const mainWin = mockWindow()
  const iframeWin = mockWindow()

  const readFnName = shortid()
  const data = Array(getRandomInt(100, 500)).fill(0).map(shortid)

  pull(
    pull.values(data),
    PMS.sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    PMS.source(readFnName, {
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
    PMS.sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    PMS.source(readFnName, {
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

test.cb('should handle iframe error gracefully', (t) => {
  const mainWin = mockWindow()
  const iframeWin = mockWindow()

  const readFnName = shortid()
  const data = Array(getRandomInt(100, 500)).fill(0).map(shortid)
  const errIndex = getRandomInt(1, data.length)
  let index = 0

  pull(
    pull.values(data),
    pull.map((data) => {
      index++
      if (index === errIndex) throw new Error('BOOM')
      return data
    }),
    PMS.sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    PMS.source(readFnName, {
      addListener: mainWin.addEventListener,
      removeListener: mainWin.removeEventListener,
      postMessage: iframeWin.postMessage
    }),
    pull.collect((err, pulledData) => {
      t.truthy(err)
      t.is(mainWin.listeners.length, 0)
      t.is(iframeWin.listeners.length, 0)
      t.end()
    })
  )
})

test.cb('should handle main error gracefully', (t) => {
  const mainWin = mockWindow()
  const iframeWin = mockWindow()

  const readFnName = shortid()
  const data = Array(getRandomInt(100, 500)).fill(0).map(shortid)
  const errIndex = getRandomInt(1, data.length)
  let index = 0

  pull(
    pull.values(data),
    PMS.sink(readFnName, {
      addListener: iframeWin.addEventListener,
      removeListener: iframeWin.removeEventListener,
      postMessage: mainWin.postMessage
    })
  )

  pull(
    PMS.source(readFnName, {
      addListener: mainWin.addEventListener,
      removeListener: mainWin.removeEventListener,
      postMessage: iframeWin.postMessage
    }),
    pull.map((data) => {
      index++
      if (index === errIndex) throw new Error('BOOM')
      return data
    }),
    pull.collect((err, pulledData) => {
      t.truthy(err)
      t.is(mainWin.listeners.length, 0)
      t.is(iframeWin.listeners.length, 0)
      t.end()
    })
  )
})

const pull = require('pull-stream')
const log = require('./log')
const source = require('../source')

const iframe = document.querySelector('iframe')

window.addEventListener('message', (msg) => {
  if (!msg.data || !msg.data.readFnName) return
  log('got read function name', msg.data.readFnName)

  pull(
    source(msg.data.readFnName, {
      postMessage: iframe.contentWindow.postMessage.bind(iframe.contentWindow)
    }),
    pull.drain(
      (data) => log('pulled data', data),
      () => log('drained')
    )
  )
})

log('main ready')

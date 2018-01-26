const pull = require('pull-stream')
const log = require('./log')
const PMS = require('../')

const iframe = document.querySelector('iframe')
const postMessage = iframe.contentWindow.postMessage.bind(iframe.contentWindow)

window.addEventListener('message', (msg) => {
  if (!msg.data || !msg.data.readFnName) return
  log('got read function name', msg.data.readFnName)

  pull(
    PMS.source(msg.data.readFnName, { postMessage }),
    pull.drain(
      (data) => log('pulled data', data),
      () => log('drained')
    )
  )
})

log('main ready')

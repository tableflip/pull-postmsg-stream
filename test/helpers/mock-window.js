module.exports = function mockWindow () {
  const win = {
    listeners: [],
    addEventListener: (_, listener) => win.listeners.push(listener),
    removeEventListener (_, listener) {
      win.listeners = win.listeners.filter(l => l !== listener)
    },
    postMessage (data) {
      data = JSON.parse(JSON.stringify(data))
      process.nextTick(() => win.listeners.forEach(l => l({ data })))
    }
  }
  return win
}

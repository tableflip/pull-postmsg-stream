const { expose } = require('postmsg-rpc')

module.exports = function sink (readFnName, opts) {
  return function (read) {
    const handle = expose(readFnName, (end) => {
      return new Promise((resolve, reject) => {
        read(end, (end, data) => {
          if (end) {
            if (end === true) {
              resolve({ end })
            } else {
              reject(end)
            }
            return handle.close()
          }

          resolve({ end, data })
        })
      })
    }, opts)
  }
}

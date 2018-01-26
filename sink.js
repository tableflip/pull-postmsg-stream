const { expose } = require('postmsg-rpc')

module.exports = function sink (readFnName, opts) {
  return function (read) {
    const handle = expose(readFnName, () => {
      return new Promise((resolve, reject) => {
        read(null, (end, data) => {
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

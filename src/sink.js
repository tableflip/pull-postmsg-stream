const { expose } = require('postmsg-rpc')

module.exports = function sink (readFnName, opts) {
  return function (read) {
    const handle = expose(readFnName, (end) => {
      return new Promise((resolve, reject) => {
        // Deserialize error
        if (end && end !== true) {
          end = Object.assign(new Error(), end)
        }

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

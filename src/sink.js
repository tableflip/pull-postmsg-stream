const { expose } = require('postmsg-rpc')
const { post } = require('prepost')

module.exports = function sink (readFnName, opts) {
  return function (read) {
    const handle = expose(readFnName, post(
      (end) => new Promise((resolve, reject) => {
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
      }),
      opts && opts.post
    ), opts)
  }
}

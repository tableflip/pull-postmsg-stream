const { caller } = require('postmsg-rpc')

module.exports = function source (readFnName, opts) {
  const read = caller(readFnName, opts)
  return (end, cb) => {
    if (end) return cb(end)
    read().then((res) => cb(res.end, res.data)).catch(cb)
  }
}

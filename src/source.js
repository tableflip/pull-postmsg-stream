const { caller } = require('postmsg-rpc')
const { pre } = require('prepost')

module.exports = function source (readFnName, opts) {
  const read = pre(opts.pre, caller(readFnName, opts))

  return (end, cb) => {
    // Serialize error into something structured cloneable
    if (end && end !== true) {
      end = Object.assign({
        message: end.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : end.stack
      }, end.output && end.output.payload)
    }

    read(end).then((res) => cb(res.end, res.data)).catch(cb)
  }
}

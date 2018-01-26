module.exports = function log () {
  console.log.apply(console, arguments)
  const el = document.getElementById('log')
  el.appendChild(document.createTextNode(Array.from(arguments).join(', ') + '\n'))
}

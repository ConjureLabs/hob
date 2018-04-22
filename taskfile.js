const notifier = require('node-notifier')
const childProcess = require('child_process')

module.exports.bin = async function bin(task) {
  await task.source('bin/*').babel().target('dist/bin', {
    mode: '0755'
  })
  notify('Compiled binaries')
}

module.exports.lib = async function lib (task, opts) {
  await task.source('lib/**/*.js').babel().target('dist/lib')
  notify('Compiled lib files')
}

module.exports.build = async function build(task) {
  await task.parallel(['bin', 'lib'])
}

module.exports.release = async function release(task) {
  await task.clear('dist').start('bin')
}

// notification helper
function notify(msg) {
  return notifier.notify({
    title: '👻 Hob',
    message: msg,
    icon: false
  })
}

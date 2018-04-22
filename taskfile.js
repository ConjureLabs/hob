const notifier = require('node-notifier')
const childProcess = require('child_process')

module.exports.bin = async function bin(task) {
  await task.source('bin/*').babel().target('dist/bin', {
    mode: '0755'
  })
  notify('Compiled binaries')
}

module.exports.build = async function build(task) {
  await task.parallel(['bin'])
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

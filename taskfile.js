const notifier = require('node-notifier')
const childProcess = require('child_process')

module.exports = {
  *bin(task) {
    task.source('bin/*').babel().target('dist/bin', {
      mode: '0755'
    })
    notify('Compiled binaries')
    yield
  },

  *release(task) {
    yield task.clear('dist').start('bin')
  }
}

// notification helper
function notify (msg) {
  return notifier.notify({
    title: 'Hob',
    message: msg,
    icon: false
  })
}

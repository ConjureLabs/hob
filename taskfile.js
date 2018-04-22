const notifier = require('node-notifier')
const childProcess = require('child_process')

module.exports = {
  async bin(task) {
    await task.source('bin/*').babel().target('dist/bin', {
      mode: '0755'
    })
    notify('Compiled binaries')
  },

  *build(task) {
    yield task.parallel(['bin']);
  },

  *release(task) {
    yield task.clear('dist').start('bin')
  }
}

// notification helper
function notify(msg) {
  return notifier.notify({
    title: 'Hob',
    message: msg,
    icon: false
  })
}

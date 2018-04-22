const notifier = require('node-notifier')
const childProcess = require('child_process')

export async function compile (task) {
  await task.parallel(['bin'])
}

export async function bin (task, opts) {
  await task.source(opts.src || 'bin/*').babel().target('dist/bin', { mode: '0755' })
  notify('Compiled binaries')
}

export default async function (task) {
  await task.start('build')
  await task.watch('bin/*', 'bin')
}

export async function release (task) {
  await task.clear('dist').start('build')
}

// notification helper
function notify (msg) {
  return notifier.notify({
    title: 'Hob',
    message: msg,
    icon: false
  })
}

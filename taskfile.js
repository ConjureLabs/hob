const notifier = require('node-notifier')

module.exports.bin = async function bin(task) {
  await task.source('bin/*').babel().target('dist/bin', {
    mode: '0755'
  })
  notify('Compiled binaries')
}

module.exports.lib = async function lib(task, opts) {
  await task.source('lib/**/*.js').babel().target('dist/lib')
  notify('Compiled lib files')
}

module.exports.copyProcs = async function copyProcs(task) {
  await task.source('procs/**/*.js').target('dist/procs')
  await task.source('procs/**/.*').target('dist/procs')
}

module.exports.copyConf = async function copyConf(task) {
  await task.source('conf/**/.*').target('dist/conf')
}

module.exports.copyDirs = async function copyDirs(task) {
  await task.parallel(['copyProcs', 'copyConf'])
}

module.exports.compile = async function compile(task) {
  await task.parallel(['bin', 'lib'])
}

module.exports.build = async function build(task) {
  await task.serial(['compile', 'copyDirs'])
} 

module.exports.release = async function release(task) {
  await task.clear('dist').start('build')
}

// notification helper
function notify(msg) {
  return notifier.notify({
    title: '👻 Hob',
    message: msg,
    icon: false
  })
}

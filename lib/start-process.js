import { spawn,  } from 'cross-spawn'

module.exports = function startProcess({
  command = 'node',
  args = []
}, onClose) {
  onClose = onClose || function() {}

  const proc = spawn(command, args, {
    stdio: 'inherit',
    cwd: __dirname
  })

  proc.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code)
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        onClose(137)
        process.exit(137)
      }
      console.log(`got signal ${signal}, exiting`)
      onClose(1)
      process.exit(1)
    }
    onClose(0)
    process.exit(0)
  })

  proc.on('error', (err) => {
    console.error(err)
    onClose(1)
    process.exit(1)
  })

  return proc
}

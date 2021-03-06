import { spawn } from 'cross-spawn'

/*
  Starts a process spawn
  If no onClose handler set, this will process.exit()
  If an onClose is set, it will return code, and not exit
 */
module.exports = function startProcess({
  command = 'node',
  args = [],
  cwd = __dirname
}, onClose) {
  onClose = typeof onClose === 'function' ? onClose : function(code) {
    process.exit(code)
  }

  if (!Array.isArray(args)) {
    throw new Error('startProcess args must be an array')
  }

  const proc = spawn(command, args, {
    stdio: 'inherit',
    cwd
  })

  proc.on('close', (code, signal) => {
    if (code !== null) {
      return onClose(code)
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        return onClose(137)
      }
      console.log(`got signal ${signal}, exiting`)
      return onClose(1)
    }
    return onClose(0)
  })

  proc.on('error', (err) => {
    console.error(err)
    return onClose(1)
  })

  return proc
}

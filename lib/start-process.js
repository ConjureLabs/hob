import { spawn,  } from 'cross-spawn'

module.exports = function startProcess({
  command = 'node',
  args = []
}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: process.env
  })

  proc.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code)
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137)
      }
      console.log(`got signal ${signal}, exiting`)
      process.exit(1)
    }
    process.exit(0)
  })
  proc.on('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  return proc
}

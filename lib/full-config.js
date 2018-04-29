import projectDir from './project-dir'
import { resolve } from 'path'
import { existsSync } from 'fs'

let isFatal = false
function fatalCondition(message) {
  isFatal = true
  console.warn(`⚠️\t${message}`)
}

module.exports = function getFullConfig() {
  if (!existsSync(resolve(projectDir, '.hob', 'config.js'))) {
    fatalCondition('a config.js file, in .hob dir, is needed for this command to work properly')
  }
  if (isFatal) {
    process.exit(1)
  }

  const hobConfig = require(`${projectDir}/.hob/config.js`)

  if (!hobConfig.clientConfig) {
    fatalCondition('Hob expects clientConfig (in .hob/config.js) to work properly')
  } else {
    if (!(typeof hobConfig.clientConfig.fullConfig === 'object')) {
      fatalCondition('Hob expects clientConfig.fullConfig (in .hob/config.js) to work properly')
    }
    if (!Array.isArray(hobConfig.clientConfig.keys)) {
      fatalCondition('Hob expects clientConfig.keys (in .hob/config.js) to work properly')
    }
  }

  if (isFatal) {
    process.exit(1)
  }

  return hobConfig.clientConfig.fullConfig
}

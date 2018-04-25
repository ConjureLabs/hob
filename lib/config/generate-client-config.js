import { resolve } from 'path'
import { writeFileSync, existsSync } from 'fs'

import projectDir from '../project-dir'

let isFatal = false
function fatalCondition(message) {
  isFatal = true
  console.warn(`⚠️\t${message}`)
}

module.exports = function generateClientConfig() {
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

  const fullConfig = hobConfig.clientConfig.fullConfig

  // each value in clientConfigKeys is expected to be dot-notated
  const clientConfig = hobConfig.clientConfig.keys.reduce((config, dotNotation) => {
    dotNotation = dotNotation.trim()
    if (!dotNotation) {
      return config
    }

    const tokens = dotNotation.split('.')
    let baseRef = fullConfig
    let localRef = config

    for (let i = 0; i < tokens.length; i++) {
      if (baseRef == undefined) {
        if (i === 0) {
          // should not be possible since full config is expected to be okay
          throw new Error('full config does not appear to be an object')
        }
        throw new Error(`client config requires ${tokens.slice(0, i + 1).join('.')}, but ${tokens.slice(0, i).join('.')} is null or undefined`)
      }

      const token = tokens[i]
      baseRef = baseRef[token]

      localRef[token] = i === tokens.length - 1 ? baseRef : localRef[token] || {}
      localRef = localRef[token]
    }

    return config
  }, {})

  const configContent = `/* eslint-disable */\n// jscs:disable\n\nexport default ${JSON.stringify(clientConfig)}\n`

  writeFileSync(resolve(projectDir, 'client.config.js'), configContent, 'utf8')
  console.log('Generated client config')
}

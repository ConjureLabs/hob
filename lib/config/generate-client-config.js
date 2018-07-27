import { resolve } from 'path'
import { writeFileSync } from 'fs'

import projectDir from '../project-dir'

module.exports = function generateClientConfig() {
  const hobConfig = require('../get-config')

  if (!Array.isArray(hobConfig.clientConfig.keys)) {
    console.warn(`⚠️\tHob expects clientConfig.keys (in .hob/config.js) to work properly`)
    process.exit(1)
  }

  // each value in clientConfigKeys is expected to be dot-notated
  const clientConfig = hobConfig.clientConfig.keys.reduce((config, dotNotation) => {
    dotNotation = dotNotation.trim()
    if (!dotNotation) {
      return config
    }

    const tokens = dotNotation.split('.')
    let baseRef = hobConfig.fullConfig
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

  const configContent = `/* eslint-disable */\n// jscs:disable\n\nmodule.exports = ${JSON.stringify(clientConfig)}\n`

  writeFileSync(resolve(projectDir, 'client.config.js'), configContent, 'utf8')
  console.log('Generated client config')
}

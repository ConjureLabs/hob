import { resolve } from 'path'
import { writeFileSync } from 'fs'

import projectDir from '../project-dir'
const hobConfig = require(`${projectDir}/.hob/config.js`)

module.exports = function generateClientConfig() {
  if (!hobConfig.serverConfigRequire) {
    throw new Error('Hob expects serverConfigRequire (in .hob/config.js) to be a require path for a full server config')
  }
  if (!hobConfig.clientConfigKeys) {
    throw new Error('Hob expects clientConfigKeys (in .hob/config.js) to be an array of dot-notated config values to carry to client config')
  }

  const fullConfig = require(`${hobConfig.serverConfigRequire}`)

  // each value in clientConfigKeys is expected to be dot-notated
  const clientConfig = hobConfig.clientConfigKeys.reduce((config, dotNotation) => {
    dotNotation = dotNotation.trim()
    if (!dotNotation) {
      return config
    }

    const tokens = dotNotation.split('.')
    let ref = fullConfig

    for (let i = 0; i < tokens.length; i++) {
      if (ref == undefined) {
        if (i === 0) {
          // should not be possible since full config is expected to be okay
          throw new Error('full config does not appear to be an object')
        }
        throw new Error(`client config requires ${tokens.slice(0, i + 1).join('.')}, but ${tokens.slice(0, i).join('.')} is null or undefined`)
      }

      const token = tokens[i]
      ref = ref[token]
      config[token] = i === tokens.length - 1 ? ref : {}

      return config
    }
  }, {})

  const configContent = `/* eslint-disable */\n// jscs:disable\n\nexport default ${JSON.stringify(clientConfig)}\n`

  writeFileSync(path.resolve(projectDir, 'client-config.js'), configContent, 'utf8')
  console.log('Generated client config')
}

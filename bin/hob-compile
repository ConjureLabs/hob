#!/usr/bin/env node

import parseArgs from 'minimist'
import { resolve } from 'path'

import startProcess from '../lib/start-process'
import generateClientConfig from '../lib/config/generate-client-config'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
})

if (argv.help) {
  console.log(`
    Description
      Compiles the application
    Usage
      $ hob build

    Options
      --fresh, -f   Removes cache before compile
      --min, -m     Use short CSS class names
  `)
  process.exit(0)
}

const stylusArgs = ['../procs/stylus/prepare']
if (argv.fresh) {
  stylusArgs.push('--fresh')
}
if (argv.min) {
  stylusArgs.push('--short-names')
}

startProcess({
  args: stylusArgs
})

generateClientConfig()

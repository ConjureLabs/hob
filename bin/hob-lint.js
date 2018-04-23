#!/usr/bin/env node

import parseArgs from 'minimist'
import { resolve } from 'path'
import { existsSync } from 'fs'

import projectDir from '../lib/project-dir'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
})

if (argv.help) {
  console.log(`
    Description
      Runs lints
    Usage
      $ hob lint

    This will run default lints, with Hob settings
    You can add a custom .eslintrc, .eslintignore, or .jscsrc
    to the root of your project if you want specific config
  `)
  process.exit(0)
}

const hobConf = resolve(__dirname, '../', 'conf')

const projectEslintrc = resolve(projectDir, '.eslintrc')
const eslintrc = existsSync(projectEslintrc) ? projectEslintrc : resolve(hobConf, '.eslintrc')
const projectEslintignore = resolve(projectDir, '.eslintignore')
const eslintignore = existsSync(projectEslintignore) ? projectEslintignore : resolve(hobConf, '.eslintignore')
startProcess({
  command: 'eslint',
  args: [
    projectDir,
    '-c', eslintrc,
    '--ignore-path', eslintignore,
    '--quiet'
  ]
})

const projectJscsrc = resolve(projectDir, '.jscsrc')
const jscsrc = existsSync(projectJscsrc) ? projectJscsrc : resolve(hobConf, '.jscsrc')
startProcess({
  command: 'jscs',
  args: [
    projectDir,
    '-c', jscsrc
  ]
})

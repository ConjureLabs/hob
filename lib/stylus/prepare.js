import fs from 'fs'
import path from 'path'
import stylus from 'stylus'
import crypto from 'crypto'
import rm from 'rimraf'
import { promisify } from 'util'

import projectDir from '../project-dir'

const rmSync = promisify(rm)
const subDirsToCrawl = ['components', 'pages']
const trackDir = path.resolve(projectDir, '.hob', '.stylus')
const trackJson = path.resolve(trackDir, 'track.json')

let classNameCount = 0

function crawlDir(dirCrawling, options) {
  const list = fs.readdirSync(dirCrawling)

  for (let resource of list) {
    let pathResolved = path.resolve(dirCrawling, resource)
    let fileStat = fs.statSync(pathResolved)

    if (fileStat.isDirectory()) {
      crawlDir(pathResolved)
      continue
    }

    if (fileStat.isFile() && resource.length > 5 && resource.substr(-5) === '.styl') {
      prepareStylus(pathResolved, options)
    }
  }
}

function prepareStylus(filePath, options) {
  // first check if it has already been generated
  let hashes = JSON.parse(fs.readFileSync(trackJson, 'utf8'))
  const content = fs.readFileSync(filePath, 'utf8')
  const currentHash = crypto.createHash('sha256').update(content).digest('hex')

  if (hashes[filePath] && hashes[filePath] === currentHash) {
    return
  }

  stylus(content)
    .set('filename', filePath)
    .render((err, css) => {
      if (err) {
        throw err
      }

      const classLookup = {}
      const pathParsed = path.parse(filePath)
      const pathTokens = pathParsed.dir
        .substr(projectDir.length + 1)
        .split('/')

      // if a file is not the typical styles.styl (say, component.styles.styl), then we need to track that to avoid name collision
      if (pathParsed.base !== 'styles.styl') {
        pathTokens.push(pathParsed.name.replace(/\.+/g, '-'))
      }

      // see https://stackoverflow.com/questions/448981/which-characters-are-valid-in-css-class-names-selectors
      css = css.replace(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?=\s|\{|\.|:|,|\)|$])/g, function classnameReplacements(_, className) {
        if (!classLookup[className]) {
          if (options.shortNames) {
            classLookup[className] = `c${++classNameCount}`
          } else {
            classLookup[className] = `${pathTokens.join('_')}__${className}`
          }
        }

        return `.${classLookup[className]}`
      })
      css = css.replace(/[\n\r]\s*/g, ' ').trim()

      const isNative = filePath.substr(-12) === '.native.styl' // native <style> tag, not jsx
      const jsxDefault = `const css = \`${css}\`\n\export default (<style ${isNative ? '' : 'jsx '}dangerouslySetInnerHTML={{ __html: css }} />)`
      const jsxLookup = `const classes = ${JSON.stringify(classLookup)}\nexport { classes }`
      const jsxContent = `/* eslint-disable */\n// jscs:disable\n\nimport React from 'react'\n\n${jsxDefault}\n\n${jsxLookup}\n`
      const jsxFilePath = filePath.replace(/\.styl$/, '.js')

      fs.writeFileSync(jsxFilePath, jsxContent, 'utf8')
      console.log(`Generated ${jsxFilePath}`)

      hashes = JSON.parse(fs.readFileSync(trackJson, 'utf8')) // re-read it just to make sure it's up to date
      hashes[filePath] = currentHash
      fs.writeFileSync(trackJson, JSON.stringify(hashes), 'utf8')
    })
}

module.exports = async function process({
  fresh = false,
  shortNames = false
}) {
  if (fresh) {
    await rmSync(trackDir)
  }

  if (!existsSync(trackJson)) {
    try {
      fs.mkdirSync(trackDir)
    } catch(err) {}
    fs.writeFileSync(trackJson, '{}', 'utf8')
  }

  for (let subdir of subDirsToCrawl) {
    crawlDir(path.resolve(projectDir, subdir), {
      shortNames
    })
  }
}

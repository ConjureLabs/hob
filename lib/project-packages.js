import projectDir from './project-dir'

// we'll detect features needed based on project's package.json
const projectPkg = require(resolve(projectDir, 'package.json'))
const packagesInstalled = Object.keys(projectPkg.dependencies).concat(
  Object.keys(projectPkg.devDependencies)
)

module.exports = packagesInstalled

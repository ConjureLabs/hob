import { resolve } from 'path'

// assuming ./lib/project-dir.js is copied to ./dist/lib/project-dir.js
// and hob is then installed in an app's node_modules
// ./node_modules/@conjurelabs/hob/dist/lib/project-dir.js
// project dir is 5 dirs up
module.exports = resolve(__dirname, '../../../../../')

const fs = require('node:fs')
const fsp = require('node:fs/promises')

let mdxBytes = 0
let mdxFiles = 0
const isMdx = (file) => String(file).includes('/src/content/') && String(file).endsWith('.mdx')
const readFileSync = fs.readFileSync
fs.readFileSync = function (file, ...args) {
  const result = readFileSync.call(this, file, ...args)
  if (isMdx(file)) {
    mdxFiles++
    mdxBytes += Buffer.byteLength(result)
  }
  return result
}
const open = fsp.open
fsp.open = async function (file, ...args) {
  const handle = await open.call(this, file, ...args)
  if (isMdx(file)) {
    mdxFiles++
    const read = handle.read.bind(handle)
    handle.read = async (...readArgs) => {
      const result = await read(...readArgs)
      mdxBytes += result.bytesRead
      return result
    }
  }
  return handle
}

process.on('message', (message) => {
  if (message === 'snapshot') {
    global.gc()
    process.send({ memory: process.memoryUsage(), mdxFiles, mdxBytes })
  }
})

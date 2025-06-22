import { argv } from 'node:process'

import { runCommand, cmdRegistry } from './commands'

async function main() {
  const [cmdName, ...cmdArgs] = argv.slice(2)
  if (!cmdName) {
    console.error('Please, provide more arguments.')
    process.exit(1)
  }
  await runCommand(cmdRegistry, cmdName, ...cmdArgs)
  process.exit(0)
}

main()

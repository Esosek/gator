import { argv } from 'node:process'

import { runCommand, commandsRegistry } from './commands'

async function main() {
  const [cmdName, ...cmdArgs] = argv.slice(2)
  if (!cmdName) {
    console.error('Please, provide more arguments.')
    process.exit(1)
  }
  await runCommand(commandsRegistry, cmdName, ...cmdArgs)
  process.exit(0)
}

main()

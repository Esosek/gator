import { argv } from 'node:process'

import { CommandsRegistry, handlerLogin, runCommand } from './commands'

const commandsRegistry: CommandsRegistry = {
  login: handlerLogin,
}

async function main() {
  const [cmdName, ...cmdArgs] = argv.slice(2)
  if (!cmdName) {
    console.error('Please, provide more arguments.')
    process.exit(1)
  }
  runCommand(commandsRegistry, cmdName, ...cmdArgs)
}

main()

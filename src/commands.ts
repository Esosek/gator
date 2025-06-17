import { setUser } from '../config'

type CommandHandler = (cmdName: string, ...args: string[]) => void
export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    console.error('Please provide a username.')
    process.exit(1)
  }
  try {
    const username = args[0]
    await setUser(username)
    console.log(username + ' logged in successfuly.')
  } catch (err) {
    console.log(err)
  }
}

function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  registry[cmdName](cmdName, ...args)
}

import { setUser, readConfig } from '../config'

async function main() {
  try {
    await setUser('Esosek')
    const config = await readConfig()
    console.log(config)
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
    }
  }
}

main()

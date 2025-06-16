import os from 'os'
import fs from 'fs'
import path from 'path'

type Config = {
  dbUrl: string
  currentUserName: string
}

export async function setUser(username: string) {
  try {
    const currentConfig = await readConfig()
    const updatedConfig = {
      "db_url": currentConfig.dbUrl,
      "current_user_name": username,
    }
    return new Promise<void>((resolve) => {
      fs.writeFile(
        getConfigFilePath(),
        JSON.stringify(updatedConfig),
        (err) => {
          if (err) {
            throw err
          } else resolve()
        }
      )
    })
  } catch (err) {
    throw new Error('Error writing the config file.')
  }
}

export function readConfig() {
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(getConfigFilePath(), 'utf-8', (err, data) => {
      if (err) {
        reject(new Error('Error reading the config file.'))
      }
      try {
        const config = validateConfig(JSON.parse(data))
        resolve(config)
      } catch (parseErr) {
        reject(new Error('Error parsing the config file.'))
      }
    })
  })
}

function getConfigFilePath() {
  const filePath = path.join(os.homedir(), '.gatorconfig.json')
  return filePath
}

function validateConfig(rawConfig: any): Config {
  const validatedConfig: Config = {
    dbUrl: rawConfig['db_url'] || '',
    currentUserName: rawConfig['current_user_name'] || '',
  }
  if (!validatedConfig.dbUrl) {
    throw new Error('Database URL is required in the configuration.')
  }
  return validatedConfig
}

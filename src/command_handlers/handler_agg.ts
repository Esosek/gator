import { scrapeFeeds } from '../rss_feed'

async function handlerAgg(cmdName: string, ...args: string[]) {
  try {
    if (!args.length) {
      throw new Error('Missing duration argument (try "1m" or "1h")')
    }
    const timeBetweenRequests = parseDuration(args[0])
    console.log('Collecting feeds every ' + args[0])
    scrapeFeeds()
    const interval = setInterval(() => {
      scrapeFeeds()
    }, timeBetweenRequests)

    // Stop collecting feeds when the program is killed
    await new Promise<void>((resolve) => {
      process.on('SIGINT', () => {
        console.log('Shutting down feed aggregator...')
        clearInterval(interval)
        resolve()
      })
    })
  } catch (error) {
    console.error('Aggregation failed:', error)
    process.exit(1)
  }
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/
  const match = durationStr.match(regex)
  if (match) {
    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'ms':
        return value
      case 's':
        return value * 1000
      case 'm':
        return value * 1000 * 60
      case 'h':
        return value * 1000 * 60 * 60
      default:
        throw new Error('Unknown time unit')
    }
  } else {
    throw new Error('Parsing duration from input failed')
  }
}

export default handlerAgg

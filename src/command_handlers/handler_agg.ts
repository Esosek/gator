import { fetchFeed } from '../rss_feed'

const FETCH_URL = 'https://www.wagslane.dev/index.xml'

async function handlerAgg(cmdName: string, ...args: string[]) {
  try {
    const feed = await fetchFeed(FETCH_URL)
    if (feed) {
      console.log(feed)
      feed.channel.item.forEach((i) => {
        console.log(i)
      })
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default handlerAgg

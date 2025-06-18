import { fetchFeed } from '../rss_feed'

const FETCH_URL = 'https://www.wagslane.dev/index.xml'

async function handlerAgg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed(FETCH_URL)
  if (feed) {
    console.log(feed)
    feed.channel.item.forEach((i) => {
      console.log(i)
    })
  }
}

export default handlerAgg

import { getFeeds } from '../lib/db/queries/feeds'

async function handlerFeeds() {
  try {
    const feeds = await getFeeds()
    feeds.forEach((feed) => console.log(feed))
  } catch (error) {
    console.error('Fetching feeds failed.')
    process.exit(1)
  }
}

export default handlerFeeds

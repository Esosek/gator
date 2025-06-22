import { XMLParser } from 'fast-xml-parser'
import { getNextFeedToFetch, markFeedFetched } from './lib/db/queries/feeds'

type RSSFeed = {
  channel: {
    title: string
    link: string
    description: string
    item: RSSItem[]
  }
}

type RSSItem = {
  title: string
  link: string
  description: string
  pubDate: string
}

export async function fetchFeed(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'gator'
      }
    })
    const body = await res.text()
    const parsedBody = new XMLParser().parse(body)
    const rssFeed = validateData(parsedBody.rss)
    return rssFeed
  } catch (error) {
    throw new Error('Fetching feed failed: ' + error)
  }
}

function validateData(body: any) {
  if (!body.channel) {
    throw new Error('Channel field does not exist')
  }
  if (!body.channel.title || !body.channel.link || !body.channel.description) {
    throw new Error('Missing required channel fields')
  }
  const rssFeed: RSSFeed = {
    channel: {
      title: body.channel.title,
      link: body.channel.link,
      description: body.channel.description,
      item: extractItem(body.channel.item)
    }
  }
  return rssFeed
}

function extractItem(item: any): RSSItem[] {
  if (!Array.isArray(item)) {
    return []
  }
  const result = item
    .map((i): RSSItem | undefined => {
      if (i.title && i.link && i.description && i.pubDate) {
        return {
          title: i.title,
          link: i.link,
          description: i.description,
          pubDate: i.pubDate
        }
      }
    })
    .filter((i) => i !== undefined)
  return result
}

export async function scrapeFeeds() {
  try {
    const feedToFetch = await getNextFeedToFetch()
    if (!feedToFetch) {
      console.log('No feeds to fetch')
      return
    }
    await markFeedFetched(feedToFetch.id)
    const fetchedFeed = await fetchFeed(feedToFetch.url)
    fetchedFeed.channel.item.forEach((i) => {
      console.log(i.title)
    })
  } catch (error) {
    console.error('Scraping feeds failed: ', error)
  }
}

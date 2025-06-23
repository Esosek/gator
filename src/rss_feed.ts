import { XMLParser } from 'fast-xml-parser'
import { getNextFeedToFetch, markFeedFetched } from './lib/db/queries/feeds'
import { createPost } from './lib/db/queries/posts'

type RSSFeed = {
  channel: {
    title: string
    link: string
    description: string
    item: Post[]
  }
}

export type Post = {
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

function extractItem(item: any): Post[] {
  if (!Array.isArray(item)) {
    return []
  }
  const result = item
    .map((i): Post | undefined => {
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
    console.log('Fetching feeds...')
    const feedToFetch = await getNextFeedToFetch()
    if (!feedToFetch) {
      console.log('No feeds to fetch')
      return
    }
    await markFeedFetched(feedToFetch.id)
    const fetchedFeed = await fetchFeed(feedToFetch.url)
    console.log('Fetched channel ' + fetchedFeed.channel.title)
    fetchedFeed.channel.item.forEach(async (i) => {
      await createPost(i, feedToFetch.id)
    })
  } catch (error) {
    console.error('Scraping feeds failed: ', error)
  }
}

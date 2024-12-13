import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import GithubSlugger from 'github-slugger'

import siteMetadata from '../data/siteMetadata'
import blogTagData from '../app/blog-tag-data.json' assert { type: 'json' }
import readingTagData from '../app/reading-tag-data.json' assert { type: 'json' }

import { allBlogs, allReadings } from '../.contentlayer/generated/index.mjs'
import { Blog, Reading } from '../.contentlayer/generated/types'

import { escape } from '../utils/htmlEscaper'
import { sortPosts } from '../utils/contentlayer'

const generateRssItem = ({ post }: { post: Blog | Reading }) => `
  <item>
    <guid>${siteMetadata.siteUrl}/${post._raw.flattenedPath}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}/${post._raw.flattenedPath}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = ({
  title,
  description,
  link,
  posts,
  feedFile,
}: {
  title: string
  description: string
  link: string
  posts: (Blog | Reading)[]
  feedFile: string
}) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${title}</title>
      <link>${link}</link>
      <description>${description}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${feedFile}" rel="self" type="application/rss+xml"/>
      ${posts.map((post: Blog | Reading) => generateRssItem({ post })).join('')}
    </channel>
  </rss>
`

async function generateRssFeed({
  title,
  description,
  posts,
  tagData,
  postType,
}: {
  title: string
  description: string
  posts: (Blog | Reading)[]
  tagData: Record<string, number>
  postType: string
}) {
  const publishPosts = posts.filter((post: Blog | Reading) => post.draft !== true)
  if (publishPosts.length > 0) {
    const rss = generateRss({
      title: title,
      description: description,
      link: `${siteMetadata.siteUrl}/${postType}`,
      posts: sortPosts(publishPosts),
      feedFile: `${postType}/feed.xml`,
    })
    const rssPath = path.join('public', postType)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, 'feed.xml'), rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = posts.filter((post) =>
        post.tags.map((t) => GithubSlugger.slug(t)).includes(tag)
      )
      const rss = generateRss({
        title: `${title}: ${tag}`,
        description: description,
        link: `${siteMetadata.siteUrl}/${postType}/tag`,
        posts: filteredPosts,
        feedFile: `tags/${postType}/${tag}/feed.xml`,
      })
      const rssPath = path.join('public', 'tags', postType, tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, 'feed.xml'), rss)
    }
  }
}

const rss = () => {
  generateRssFeed({
    title: `${siteMetadata.title} -- Blog posts`,
    description: `Blog posts`,
    posts: allBlogs as unknown as Blog[],
    tagData: blogTagData,
    postType: 'blog',
  })
  generateRssFeed({
    title: `${siteMetadata.title} -- Paper summaries`,
    description: `Paper summaries`,
    posts: allReadings as unknown as Reading[],
    tagData: readingTagData,
    postType: 'reading',
  })
  console.log('RSS feed generated...')
}

export default rss

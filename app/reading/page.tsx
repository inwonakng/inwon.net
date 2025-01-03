import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from '@/utils/contentlayer'
import { allReadings } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 15

export const metadata = {
  ...genPageMetadata({ title: 'Reading' }),
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/blog/feed.xml`,
    },
  },
}

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allReadings))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      description="Informal summaries of stuff I've read"
      postGroup="reading"
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}

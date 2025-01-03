import { slug } from 'github-slugger'
import { CoreContent, allCoreContent, sortPosts } from '@/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { Blog, Reading, allBlogs, allReadings } from 'contentlayer/generated'
import blogTagData from 'app/blog-tag-data.json'
import readingTagData from 'app/reading-tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ tag: string; tagGroup: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const tagGroup = decodeURI(params.tagGroup)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content for ${tagGroup}`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tagGroup}/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const blogTagCounts = blogTagData as Record<string, number>
  const blogPaths = Object.keys(blogTagCounts).map((tag) => ({
    tag: encodeURI(tag),
    tagGroup: 'blog',
  }))
  const readingTagCounts = readingTagData as Record<string, number>
  const readingPaths = Object.keys(readingTagCounts).map((tag) => ({
    tag: encodeURI(tag),
    tagGroup: 'reading',
  }))
  return [...blogPaths, ...readingPaths]
}

export default async function TagPage(props: {
  params: Promise<{ tag: string; tagGroup: string }>
}) {
  const params = await props.params
  const allPosts = {
    blog: allBlogs,
    reading: allReadings,
  }
  const tag = decodeURI(params.tag)
  const tagGroup = decodeURI(params.tagGroup)
  // Capitalize first letter and convert space to dash
  const title = tag
    .split(' ')
    .map((t) => t.toUpperCase())
    .join('-')
  // tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  const filteredPosts: CoreContent<Blog | Reading>[] = allCoreContent(
    sortPosts(
      allPosts[tagGroup].filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))
    )
  )
  const listTitle = `Results for "${tag}" in ${tagGroup}/`
  return <ListLayout posts={filteredPosts} postGroup={tagGroup} title={listTitle} isFiltered />
}

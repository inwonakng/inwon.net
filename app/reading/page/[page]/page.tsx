import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from '@/utils/contentlayer'
import { allReadings } from 'contentlayer/generated'

const POSTS_PER_PAGE = 15

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allReadings.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allReadings))
  const pageNumber = parseInt(params.page as string)
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
      title="All Posts"
      description="Very informal summaries of papers I've read"
      postGroup="reading"
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
    />
  )
}

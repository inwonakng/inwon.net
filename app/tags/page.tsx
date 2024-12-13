import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import blogTagData from 'app/blog-tag-data.json'
import readingTagData from 'app/reading-tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const blogTagCounts = blogTagData as Record<string, number>
  const blogTagKeys = Object.keys(blogTagCounts)
  const blogSortedTags = blogTagKeys.sort((a, b) => blogTagCounts[b] - blogTagCounts[a])

  const readingTagCounts = readingTagData as Record<string, number>
  const readingTagKeys = Object.keys(readingTagCounts)
  const readingSortedTags = readingTagKeys.sort((a, b) => readingTagCounts[b] - readingTagCounts[a])

  return (
    <>
      <div className="mt-2 flex w-full flex-col items-center justify-center space-x-6 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-x-2 pb-4 pt-4 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Blog Tags
          </h1>
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-2 pt-8">
          {blogTagKeys.length === 0 && 'No tags found.'}
          {blogSortedTags.map((t) => (
            <li key={t}>
              <Tag tagName={t} tagGroup="blog" text={t} tagCount={blogTagCounts[t]} />
            </li>
          ))}
        </ul>
        <div className="space-x-2 pb-4 pt-8 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Reading Tags
          </h1>
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-2 pt-8">
          {readingTagKeys.length === 0 && 'No tags found.'}
          {readingSortedTags.map((t) => (
            <li key={t}>
              <Tag tagName={t} tagGroup="reading" text={t} tagCount={readingTagCounts[t]} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

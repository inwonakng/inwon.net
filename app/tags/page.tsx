import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="mt-2 flex w-full flex-col items-center justify-center space-x-6 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-x-2 pb-4 pt-4 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Tags
          </h1>
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-2 pt-8">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => (
            <li key={t}>
              <Tag tagName={t} text={`${t} (${tagCounts[t]})`} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

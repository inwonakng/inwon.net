'use client'
import { useState } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

const MAX_DISPLAY = 5

export default function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })
  //
  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts = filteredPosts
  // initialDisplaydisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 py-8 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Latest Posts
          </h1>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!displayPosts.length && 'No posts found.'}
          {displayPosts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-4">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-5 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-2 xl:col-span-4">
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <ul className="flex flex-wrap gap-x-2">
                          {tags.map((tag) => (
                            <li>
                              <Tag key={tag} text={tag} tagName={tag} />
                            </li>
                          ))}
                        </ul>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {displayPosts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Blog Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}

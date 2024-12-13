/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from '@/utils/formatDate'
import { CoreContent } from '@/utils/contentlayer'
import type { Blog, Reading } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import blogTagData from 'app/blog-tag-data.json'
import readingTagData from 'app/reading-tag-data.json'

const tagDataByKind = {
  blog: blogTagData,
  reading: readingTagData,
}

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog | Reading>[]
  postGroup: string
  title: string
  initialDisplayPosts?: CoreContent<Blog | Reading>[]
  pagination?: PaginationProps
  isFiltered?: boolean
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  postGroup,
  title,
  initialDisplayPosts = [],
  pagination,
  isFiltered = false,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagDataByKind[postGroup] as Record<string, number>
  const tagKeys = Object.keys(tagCounts)

  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })
  // const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const displayPosts =
    initialDisplayPosts.length > 0
      ? !searchValue
        ? initialDisplayPosts
        : filteredPosts
      : !searchValue
        ? posts
        : filteredPosts

  return (
    <div className="mx-auto w-full px-4 sm:w-4/5 sm:px-0">
      <div className="py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {isFiltered && (
            <Link
              href={`/${postGroup}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {`Back to ${postGroup}/`}
            </Link>
          )}
        </div>
        <div className="max-w relative">
          <input
            aria-label="Search articles"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search articles"
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-300"
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="">
        <div className="">
          <ul>
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path} className="py-5">
                  <article className="flex flex-col space-y-2 xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h2>
                      <ul className="flex flex-wrap gap-2">
                        {tags?.sort().map((tag) => (
                          <li key={tag}>
                            <Tag
                              text={tag}
                              tagGroup={postGroup}
                              tagName={tag}
                              tagCount={tagCounts[slug(tag)]}
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && !searchValue && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}

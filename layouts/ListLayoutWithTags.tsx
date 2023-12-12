/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
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
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

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
    <>
      <div>
        <div className="py-8">
          <h1 className="mb-4 text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h1>
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
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <div className="col-span-3">
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
                        <ul className="flex flex-wrap gap-x-2">
                          {tags?.map((tag) =>
                            <li>
                              <Tag key={tag} text={tag} tagName={tag} />
                            </li>
                          )}
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
          <div className="col-span-1 hidden h-full max-h-screen flex-wrap overflow-auto rounded bg-sky-300/30 pt-5 shadow-md dark:bg-gray-700/30 dark:shadow-gray-800/40 sm:flex">
            {/* <div className=""> */}
            <div className="flex w-full flex-row items-center gap-4 px-4">
              <div className="w-1/6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="var(--ci-primary-color, currentColor)"
                    d="M511.974,271.891a47.744,47.744,0,0,0-14.706-33.008L311.57,57.98a29.9,29.9,0,0,0-21.2-8.731H257.228l217.754,212.6.092.088a15.907,15.907,0,0,1,.741,22.337l-156.4,173.355,21.953,21.356L499.447,305.85A47.748,47.748,0,0,0,511.974,271.891Z"
                    className="ci-primary"
                  />
                  <path
                    fill="var(--ci-primary-color, currentColor)"
                    d="M426.9,283.161a23.924,23.924,0,0,0-5.231-24.742c-.106-.111-.2-.231-.306-.34L224.307,57.716l-.094-.094a31.791,31.791,0,0,0-22.628-9.373H60.194A44.244,44.244,0,0,0,16,92.443v141.1a32.121,32.121,0,0,0,10.045,23.28l210.32,200.2.077.073a23.817,23.817,0,0,0,16.409,6.508q.447,0,.9-.017a24.111,24.111,0,0,0,6.741-1.217,23.854,23.854,0,0,0,10.047-6.517L421.983,291.232A24.033,24.033,0,0,0,426.9,283.161ZM252.5,428.2,48.077,233.612,48,233.54V92.443A12.208,12.208,0,0,1,60.194,80.249h141.39l191.7,194.918Z"
                    className="ci-primary"
                  />
                  <path
                    fill="var(--ci-primary-color, currentColor)"
                    d="M140,112a52,52,0,1,0,52,52A52.059,52.059,0,0,0,140,112Zm0,72a20,20,0,1,1,20-20A20.023,20.023,0,0,1,140,184Z"
                    className="ci-primary"
                  />
                </svg>
              </div>
              <h3 className="items-center justify-center font-bold">Tags</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="flex flex-wrap gap-x-2 gap-y-2">
                {sortedTags.map((t) => {
                  return (
                    <li
                      key={t}
                      className="border-1 bg-gray-400/30 rounded border-solid border-primary-900"
                    >
                      {pathname.split('/tags/')[1] === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

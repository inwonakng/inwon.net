import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <div>
                <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2">
                  <dt className="sr-only">Authors</dt>
                  <dd>
                    <ul className="flex-col justify-center xl:pt-2">
                      {authorDetails.map((author) => (
                        <li
                          className="flex items-center justify-center space-x-2"
                          key={author.name}
                        >
                          <dl className="whitespace-nowrap text-sm font-medium leading-5">
                            <dt className="sr-only">Name</dt>
                            <dd>{author.name}</dd>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </dd>
                  {tags && (
                    <div className="flex flex-col gap-y-2 py-4">
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Tags
                      </h2>
                      <ul className="flex flex-wrap justify-center space-x-2">
                        {tags.map((tag) => (
                          <li key={tag}>
                            <Tag tagName={tag} text={tag} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(next || prev) && (
                    // <div className="flex justify-between items-center py-4 flex-col space-y-2 md:flex-row md:space-y-0">
                    <div className="grid gap-2 md:grid-cols-2">
                      {prev && prev.path && (
                        <Link href={`/${prev.path}`}>
                          <div className="border-1 rounded-md border-solid border-primary-400 bg-gray-400/30 px-4 py-2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-100">
                              &larr; Previous Article
                            </h2>
                            {prev.title}
                          </div>
                        </Link>
                      )}
                      {next && next.path && (
                        <Link href={`/${next.path}`}>
                          <div className="border-1 rounded-md border-solid border-primary-400 bg-gray-400/30 px-4 py-2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-100">
                              Next Article &rarr;
                            </h2>
                            {next.title}
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <Link
                    href={`/${basePath}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Back to the blog"
                  >
                    &larr; Back to the blog
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
            <div className="prose max-w-none break-words py-4 dark:prose-invert">{children}</div>
            <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
              <Link href={discussUrl(path)} rel="nofollow">
                Discuss on Twitter
              </Link>
              {` • `}
              <Link href={editUrl(filePath)}>View on GitHub</Link>
            </div>
            {siteMetadata.comments && (
              <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}

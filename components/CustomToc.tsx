'use client'

import Link from '@/components/Link'
import { useState } from 'react'

// contentlayer does not handle toc so nicely.. declaring my own here
export type TocItem = {
  value: string
  depth: number
  url: string
}

export type Toc = TocItem[]

interface DesktopTocProps {
  toc: Toc
}

const offset = {
  1: '',
  2: 'ml-4',
  3: 'ml-8',
}

export const DesktopToc = ({ toc }: DesktopTocProps) => {
  const [expanded, setExpanded] = useState(true)
  const minDepth = Math.min(...toc.map((item) => item.depth)) - 1

  return (
    <>
      {toc.length > 0 && (
        <div
          className={`fixed bottom-2/3 right-1 top-1/3
          flex h-[40%]
          max-w-[20%] -translate-y-1/2 transform
          items-center justify-center
          `}
        >
          <div
            className={`flex
            max-h-full flex-row
            items-center items-stretch justify-center 
            overflow-y-auto rounded-l-lg 
            border-2 border-solid
            border-gray-300 bg-gray-200/30 dark:bg-gray-500/60
            `}
          >
            <button onClick={() => setExpanded(!expanded)} className="py-10">
              {expanded ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.293 18.707a1 1 0 0 1 0-1.414L14.586 12 9.293 6.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0z"
                    fill="#0D0D0D"
                  />{' '}
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.707 5.293a1 1 0 0 1 0 1.414L9.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0z"
                    fill="#0D0D0D"
                  />
                </svg>
              )}
            </button>
            <div
              className={`${!expanded && 'hidden'} 
              overflow-auto px-2 pb-4 pt-2
              `}
            >
              <h3 className="text-base font-bold">Table of contents</h3>
              <ul className={`flex flex-col text-sm`}>
                {toc.map((item) => (
                  <li key={item.url} className={`${offset[item.depth - minDepth]}`}>
                    <Link href={item.url}>
                      {`• `}
                      {item.value}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface MobileTocProps {
  toc: Toc
}

export const MobileToc = ({ toc }: MobileTocProps) => {
  const [expanded, setExpanded] = useState(true)
  const minDepth = Math.min(...toc.map((item) => item.depth)) - 1

  return (
    <>
      {toc.length > 0 && (
        <div
          className={`gap-y-2 divide-y divide-gray-200 py-4
          dark:divide-gray-700`}
        >
          <div
            className={`
              flex
              max-h-full flex-row
              items-center items-stretch justify-center 
              overflow-y-auto rounded-t-lg
              border-2 border-solid
              border-gray-300 bg-gray-200/30 dark:bg-gray-500/60
            `}
          >
            <button onClick={() => setExpanded(!expanded)} className="w-full">
              <div className="flex flex-row items-center justify-center gap-x-2">
                <h3 className="text-base font-bold">Table of contents</h3>
                {expanded ? (
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m6 15 5.2929-5.29289c.3333-.33334.5-.5.7071-.5s.3738.16666.7071.5l5.2929 5.29289"
                      stroke="#2a353d"
                    />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m6 9 5.2929 5.2929c.3333.3333.5.5.7071.5s.3738-.1667.7071-.5l5.2929-5.2929"
                      stroke="#2a353d"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
          <div
            className={`${!expanded && 'hidden'} 
              overflow-auto px-2 pb-4 pt-2
              `}
          >
            <div className="flex flex-col items-center justify-center">
              <ul className={`flex flex-col pt-2 text-sm`}>
                {toc.map((item) => (
                  <li key={item.url}>
                    <Link href={item.url} className={`${offset[item.depth - minDepth]}`}>
                      {`• `}
                      {item.value}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

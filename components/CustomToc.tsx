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
  1: "",
  2: "ml-4",
  3: "ml-8",
}

export const DesktopToc = ({ toc }: DesktopTocProps) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      {toc.length > 0 && (
        <div
          className={`fixed bottom-1/2 right-1 
          top-1/2 flex h-[40%] max-w-[20%] -translate-y-1/2 
          transform items-center justify-center
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
                  <li key={item.url} className={`${offset[item.depth]}`}>
                    <Link href={item.url} >
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
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 divide-y divide-gray-200 py-4 dark:divide-gray-700">
      <h3 className="font-bold text-base">Table of contents</h3>
      <ul className={`pt-2 flex flex-col text-sm`}>
        {toc.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className={`${offset[item.depth]}`}>
              {`• `}
              {item.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

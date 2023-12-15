import Link from '@/components/Link';
import { useState } from 'react';

// contentlayer does not handle toc so nicely.. declaring my own here
export type TocItem = {
  value: string;
  depth: number;
  url: string;
};

export type Toc = TocItem[];

interface DesktopTocProps {
  toc: Toc,
}

        {/* <div className="max-w-[17%] fixed top-1/2 bottom-1/2 right-0 h-max transform -translate-y-1/2 "> */}
export const DesktopToc = ({ toc }: DesktopTocProps) => {
  const { innerWidth: width, innerHeight: height } = window;
  const [expanded, setExpanded] = useState(width > 786)
  return (
    <>
      {toc.length > 0 &&

        <div 
          className={`fixed h-[40%] max-w-[20%] 
          right-1 top-1/2 bottom-1/2 transform -translate-y-1/2 
          flex justify-center items-center
          `}
        >
          <div 
            className={`max-h-full
            flex flex-row
            justify-center items-center items-stretch 
            overflow-y-auto rounded-l-lg 
            bg-gray-200/30 dark:bg-gray-500/60
            border-gray-300 border-2 border-solid
            `}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="py-10"
            >
              {
                expanded
                  ?
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 18.707a1 1 0 0 1 0-1.414L14.586 12 9.293 6.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0z" fill="#0D0D0D" /> </svg>
                  :
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 5.293a1 1 0 0 1 0 1.414L9.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0z" fill="#0D0D0D" /></svg>
              }
            </button>
            <div 
              className={`${!expanded && "hidden"} 
              pt-2 pb-4 px-2 overflow-auto
              `}>
              <h3 className="font-bold text-base">
                Table of contents
              </h3>
              <ul className={`flex flex-col justify-center items-left text-sm m-0 p-0`}>
                {toc.map(item =>
                  <li>
                    <Link href={item.url} className={`ml-${(item.depth - 1) * 4}`}>
                      {`• `}
                      {item.value}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      }
    </>
  )
}

interface MobileTocProps {
  toc: Toc,
}

export const MobileToc = ({ toc }: MobileTocProps) => {
  return (
    <div className="flex justify-center items-center flex-col py-4 gap-y-2 divide-y divide-gray-200 dark:divide-gray-700">
      <h3 className="font-bold">
        Table of contents
      </h3>
      <ul className="pt-2">
        {toc.map(item =>
          <li>
            <Link href={item.url} className={`ml-${(item.depth - 1) * 4}`}>
              {`• `}
              {item.value}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

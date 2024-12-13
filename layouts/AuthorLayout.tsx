'use client'

import { ReactNode, useEffect, useState } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, easterEggAvatar, occupation, company, email, twitter, linkedin, github } =
    content

  const [firstKeyTime, setFirstKeyTime] = useState<number | null>(null)
  const [easterEggActivated, setEasterEggActivated] = useState<boolean | null>(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '<') {
        setFirstKeyTime(Date.now())
      } else if (event.key === '3' && firstKeyTime) {
        const currentTime = Date.now()
        if (currentTime - firstKeyTime <= 300) {
          setFirstKeyTime(null)
          setEasterEggActivated(!easterEggActivated)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [firstKeyTime, easterEggActivated])

  return (
    <>
      <div className="flex flex-col">
        <div className="m-auto flex flex-col items-center pt-4">
          {avatar && (
            <Image
              src={easterEggActivated && easterEggAvatar ? easterEggAvatar : avatar}
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
          )}
          <div className="pt-4 text-center text-gray-500 dark:text-gray-400">{occupation}</div>
          <div className="text-center text-gray-500 dark:text-gray-400">{company}</div>
        </div>
        <div className="prose max-w-none pt-4 dark:prose-invert">{children}</div>
      </div>
    </>
  )
}

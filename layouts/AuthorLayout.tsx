import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <div className="flex flex-col">
        <div className="m-auto flex flex-col items-center pt-4">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
          )}
          <div className="pt-4 text-center text-gray-500 dark:text-gray-400">{occupation}</div>
          <div className="text-center text-gray-500 dark:text-gray-400">{company}</div>
        </div>
        <div className="dark:prose-invert prose max-w-none pt-4">{children}</div>
      </div>
    </>
  )
}

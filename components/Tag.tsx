import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  tagName: string
  tagGroup: string
  text: string
}

const Tag = ({ tagName, tagGroup, text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(tagGroup)}/${slug(tagName)}`}
      className="border-1 rounded border-solid border-primary-900 bg-gray-400/30 px-3 py-1 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      aria-label={`View posts tagged ${tagName} in ${tagGroup}`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag

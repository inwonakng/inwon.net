import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  tagName: string
  text: string
}

const Tag = ({ tagName, text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(tagName)}`}
      className="border-1 bg-gray-400/30 rounded border-solid border-primary-900 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-1"
      aria-label={`View posts tagged ${tagName}`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag

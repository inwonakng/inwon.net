import { Author, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  // ignore others and just select default one to show.
  const author = allAuthors.find((p) => p.slug === 'default') as Author
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}

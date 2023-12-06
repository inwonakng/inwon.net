import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div>
        <div className="pb-2 pt-4">
          <h1 className="text-3xl font-extrabold leading-9 text-gray-900 dark:text-gray-100">
            Projects
          </h1>
          {/* <p className="text-lg leading-7 text-gray-500 dark:text-gray-400"> */}
          {/*   Showcase your projects with a hero image (16 x 9) */}
          {/* </p> */}
        </div>
        <div className="container py-4">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

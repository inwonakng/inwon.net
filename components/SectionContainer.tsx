import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 2xl:max-w-6xl">
      {/* <section className="mx-auto max-w-3xl xl:max-w-4xl 2xl:max-w-6xl"> */}
      {children}
    </section>
  )
}

// @ts-nocheck
'use client'

import { useTheme } from 'next-themes'
import GiscusComponent from '@giscus/react'
import type { Mapping, BooleanString, InputPosition } from '@giscus/react'

export interface GiscusConfig {
  themeURL?: string
  theme?: string
  darkTheme?: string
  mapping: Mapping
  repo: string
  repositoryId: string
  category: string
  categoryId: string
  reactions: BooleanString
  metadata: BooleanString
  inputPosition?: InputPosition
  lang?: string
}

export type GiscusProps = GiscusConfig

export const Giscus = ({
  themeURL,
  theme,
  darkTheme,
  repo,
  repositoryId,
  category,
  categoryId,
  reactions,
  metadata,
  inputPosition,
  lang,
  mapping,
}: GiscusProps) => {
  const { theme: nextTheme, resolvedTheme } = useTheme()
  const commentsTheme =
    themeURL === ''
      ? nextTheme === 'dark' || resolvedTheme === 'dark'
        ? darkTheme
        : theme
      : themeURL

  const COMMENTS_ID = 'comments-container'

  return (
    <GiscusComponent
      id={COMMENTS_ID}
      repo={repo}
      repoId={repositoryId}
      category={category}
      categoryId={categoryId}
      mapping={mapping}
      reactionsEnabled={reactions}
      emitMetadata={metadata}
      inputPosition={inputPosition}
      theme={commentsTheme}
      lang={lang}
      loading="lazy"
    />
  )
}

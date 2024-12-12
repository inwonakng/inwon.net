/* eslint-disable react/display-name */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react'
import * as _jsx_runtime from 'react/jsx-runtime'
import ReactDOM from 'react-dom'
import TOCInline from '@/components/TOCInline'
import Pre from '@/components/Pre'
import BlogNewsletterForm from '@/components/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export interface MDXLayoutRenderer {
  code: string
  components?: MDXComponents
  [key: string]: unknown
}

const getMDXComponent = (
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals }
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

// TS transpile it to a require which causes ESM error
// Copying the function from contentlayer as a workaround
// Copy of https://github.com/contentlayerdev/contentlayer/blob/main/packages/next-contentlayer/src/hooks/useMDXComponent.ts
export const useMDXComponent = (
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals])
}

export const MDXLayoutRenderer = ({ code, components, ...rest }: MDXLayoutRenderer) => {
  const Mdx = useMDXComponent(code)

  return <Mdx components={components} {...rest} />
}

const Sample = () => <div className="border-4 border-solid border-primary-900">Hello World!</div>

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  Sample,
  BlogNewsletterForm,
}

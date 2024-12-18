// Code from https://github.com/jaywcjlove/remark-github-blockquote-alert/tree/main

import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, PhrasingContent } from 'mdast'

const alertRegex = /^\[!(INFO|NOTE|TIP|IMPORTANT|WARNING|DANGER|ABSTRACT|QUESTION|BUG)\]/i

const alertLegacyRegex =
  /^\[!(INFO|NOTE|TIP|IMPORTANT|WARNING|DANGER|ABSTRACT|QUESTION|BUG)(\/.*)?\]/i

type Option = {
  /**
   * Use the legacy title format, which includes a slash and a title after the alert type.
   * Enabling legacyTitle allows modifying the title, but this is not GitHub standard.
   */
  legacyTitle?: boolean
  /**
   * The tag name of the alert container. default is `div`.
   * or you can use `blockquote` for semantic HTML.
   */
  tagName?: string
}

/**
 * Alerts are a Markdown extension based on the blockquote syntax that you can use to emphasize critical information.
 * On GitHub, they are displayed with distinctive colors and icons to indicate the significance of the content.
 * https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
export const remarkCallout = ({ legacyTitle = false, tagName = 'div' }: Option = {}) => {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      let alertType = ''
      let title = ''
      let isNext = true
      const child = node.children.map((item) => {
        if (isNext && item.type === 'paragraph') {
          const firstNode = item.children[0]
          const text = firstNode.type === 'text' ? firstNode.value : ''
          const reg = legacyTitle ? alertLegacyRegex : alertRegex
          const match = text.match(reg)
          if (match) {
            isNext = false
            alertType = match[1].toLocaleLowerCase()
            title = legacyTitle
              ? match[2] || alertType.toLocaleUpperCase()
              : alertType.toLocaleUpperCase()
            if (text.includes('\n')) {
              item.children[0] = {
                type: 'text',
                value: text.replace(reg, '').replace(/^\n+/, ''),
              }
            }

            if (!text.includes('\n')) {
              const itemChild: Array<PhrasingContent> = []
              item.children.forEach((item, idx) => {
                if (idx == 0) return
                if (idx == 1 && item.type === 'break') {
                  return
                }
                itemChild.push(item)
              })
              item.children = [...itemChild]
            }
          }
        }
        return item
      })

      if (alertType) {
        node.data = {
          hName: tagName,
          hProperties: {
            class: `markdown-alert markdown-alert-${alertType}`,
            dir: 'auto',
          },
        }
        child.unshift({
          type: 'paragraph',
          children: [
            getAlertIcon(alertType as IconType),
            {
              type: 'text',
              value: title.replace(/^\//, ''),
            },
          ],
          data: {
            hProperties: {
              class: 'markdown-alert-title',
              dir: 'auto',
            },
          },
        })
      }
      node.children = [...child]
    })
  }
}

export const getAlertIcon = (iconType: IconType) => {
  const iconTypeData = iconData[iconType] ?? ['']
  return {
    type: 'emphasis',
    data: {
      hName: 'svg',
      hProperties: {
        class: 'octicon',
        viewBox: '0 0 24 24',
        width: '24',
        height: '24',
        ariaHidden: 'true',
      },
    },
    children: iconTypeData.map((data) => ({
      type: 'emphasis',
      data: data,
      children: [],
    })),
  }
}

type IconType =
  | 'info'
  | 'note'
  | 'tip'
  | 'important'
  | 'warning'
  | 'danger'
  | 'abstract'
  | 'question'
  | 'bug'

type IconData = {
  hName: string
  hProperties: Record<string, string>
}

const iconData: Record<IconType, IconData[]> = {
  info: [
    {
      hName: 'circle',
      hProperties: { cx: '12', cy: '12', r: '10' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 16v-4' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 8h.01' },
    },
  ],
  note: [
    {
      hName: 'path',
      hProperties: {
        d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
      },
    },
    {
      hName: 'path',
      hProperties: { d: 'm15 5 4 4' },
    },
  ],
  abstract: [
    {
      hName: 'rect',
      hProperties: { x: '8', y: '2', width: '8', height: '4', rx: '1', ry: '1' },
    },
    {
      hName: 'path',
      hProperties: {
        d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
      },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 11h4' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 16h4' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M8 11h.01' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M8 16h.01' },
    },
  ],
  tip: [
    {
      hName: 'path',
      hProperties: {
        d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
      },
    },
  ],
  important: [
    {
      hName: 'path',
      hProperties: {
        d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 7v2' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 13h.01' },
    },
  ],
  question: [
    {
      hName: 'circle',
      hProperties: { cx: '12', cy: '12', r: '10' },
    },
    {
      hName: 'path',
      hProperties: {
        d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
      },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 17h.01' },
    },
  ],
  warning: [
    {
      hName: 'path',
      hProperties: {
        d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
      },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 9v4' },
    },
    {
      hName: 'path',
      hProperties: { d: 'M12 17h.01' },
    },
  ],
  danger: [
    {
      hName: 'path',
      hProperties: {
        d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
      },
    },
  ],
  bug: [
    {
      hName: 'path',
      hProperties: {
        d: 'm8 2 1.88 1.88',
      },
    },
    {
      hName: 'path',
      hProperties: {
        d: 'M14.12 3.88 16 2',
      },
    },
    {
      hName: 'path',
      hProperties: {
        d: 'M9 7.13v-1a3.003 3.003 0 1 1 6 0v1',
      },
    },
    {
      hName: 'path',
      hProperties: {
        d: 'M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6',
      },
    },
    { hName: 'path', hProperties: { d: 'M12 20v-9' } },
    { hName: 'path', hProperties: { d: 'M6.53 9C4.6 8.8 3 7.1 3 5' } },
    { hName: 'path', hProperties: { d: 'M6 13H2' } },
    { hName: 'path', hProperties: { d: 'M3 21c0-2.1 1.7-3.9 3.8-4' } },
    { hName: 'path', hProperties: { d: 'M20.97 5c0 2.1-1.6 3.8-3.5 4' } },
    { hName: 'path', hProperties: { d: 'M22 13h-4' } },
    { hName: 'path', hProperties: { d: 'M17.2 17c2.1.1 3.8 1.9 3.8 4' } },
  ],
}

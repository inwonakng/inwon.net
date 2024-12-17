// Code from https://github.com/jaywcjlove/remark-github-blockquote-alert/tree/main

import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, PhrasingContent } from 'mdast'

const alertRegex = /^\[!(INFO|NOTE|TIP|IMPORTANT|WARNING|DANGER|ABSTRACT|QUESTION|BUG)\]/i
const alertLegacyRegex = /^\[!(INFO|NOTE|TIP|IMPORTANT|WARNING|DANGER|ABSTRACT|QUESTION|BUG)(\/.*)?\]/i

type Option = {
  /**
   * Use the legacy title format, which includes a slash and a title after the alert type.
   *
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
export const remarkCallout: Plugin<[Option?], Root> = ({
  legacyTitle = false,
  tagName = 'div',
} = {}) => {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      let alertType = ''
      let title = ''
      let isNext = true
      let child = node.children.map((item) => {
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

      if (!!alertType) {
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

export function getAlertIcon(type: IconType): PhrasingContent {
  let iconTypeData = iconData[type] ?? ['']
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

const iconData: Record<IconType, string> = {
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
  // important: [
  //   'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  // ],
  // warning: [
  //   'M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  // ],
  // caution: [
  //   'M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  // ],
  // abstract: [
  //   'M 7 0 C 4.796875 0 3 1.796875 3 4 L 3 22 C 3 24.203125 4.796875 26 7 26 L 19 26 C 21.203125 26 23 24.203125 23 22 L 23 8 C 23 6.9375 22.027344 5.929688 20.28125 4.21875 C 20.039063 3.980469 19.777344 3.714844 19.53125 3.46875 C 19.285156 3.222656 19.019531 2.992188 18.78125 2.75 C 17.070313 1.003906 16.0625 0 15 0 Z M 7 2 L 14.28125 2 C 15.003906 2.183594 15 3.050781 15 3.9375 L 15 7 C 15 7.550781 15.449219 8 16 8 L 19 8 C 19.996094 8 21 8.003906 21 9 L 21 22 C 21 23.105469 20.105469 24 19 24 L 7 24 C 5.894531 24 5 23.105469 5 22 L 5 4 C 5 2.894531 5.894531 2 7 2 Z M 7.8125 10 C 7.261719 10.050781 6.855469 10.542969 6.90625 11.09375 C 6.957031 11.644531 7.449219 12.050781 8 12 L 18 12 C 18.359375 12.003906 18.695313 11.816406 18.878906 11.503906 C 19.058594 11.191406 19.058594 10.808594 18.878906 10.496094 C 18.695313 10.183594 18.359375 9.996094 18 10 L 8 10 C 7.96875 10 7.9375 10 7.90625 10 C 7.875 10 7.84375 10 7.8125 10 Z M 7.8125 14 C 7.261719 14.050781 6.855469 14.542969 6.90625 15.09375 C 6.957031 15.644531 7.449219 16.050781 8 16 L 16 16 C 16.359375 16.003906 16.695313 15.816406 16.878906 15.503906 C 17.058594 15.191406 17.058594 14.808594 16.878906 14.496094 C 16.695313 14.183594 16.359375 13.996094 16 14 L 8 14 C 7.96875 14 7.9375 14 7.90625 14 C 7.875 14 7.84375 14 7.8125 14 Z M 7.8125 18 C 7.261719 18.050781 6.855469 18.542969 6.90625 19.09375 C 6.957031 19.644531 7.449219 20.050781 8 20 L 18 20 C 18.359375 20.003906 18.695313 19.816406 18.878906 19.503906 C 19.058594 19.191406 19.058594 18.808594 18.878906 18.496094 C 18.695313 18.183594 18.359375 17.996094 18 18 L 8 18 C 7.96875 18 7.9375 18 7.90625 18 C 7.875 18 7.84375 18 7.8125 18 Z',
  // ],
  // quote: [
  //   'M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
  //   'M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
  // ],
}

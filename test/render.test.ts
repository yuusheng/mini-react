// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import React from '../packages/core/src'

describe('React.createElement', () => {
  it('should create div vDom', () => {
    const element = React.createElement('div', null, 'React.createElement')
    expect(element).toEqual({
      props: {
        children: [
          {
            props: {
              children: [],
              nodeValue: 'React.createElement',
            },
            type: 'TEXT_ELEMENT',
          },
        ],
      },
      type: 'div',
    })

    const elementWithId = React.createElement('div', { id: 'root' }, 'React.createElement')
    expect(elementWithId).toEqual({
      props: {
        children: [
          {
            props: {
              children: [],
              nodeValue: 'React.createElement',
            },
            type: 'TEXT_ELEMENT',
          },
        ],
        id: 'root',
      },
      type: 'div',
    })
  })
})

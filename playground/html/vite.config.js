const { resolve } = require('node:path')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
        scriptAsync: resolve(__dirname, 'scriptAsync.html'),
        scriptMixed: resolve(__dirname, 'scriptMixed.html'),
        emptyAttr: resolve(__dirname, 'emptyAttr.html'),
        link: resolve(__dirname, 'link.html'),
        'link/target': resolve(__dirname, 'index.html'),
        zeroJS: resolve(__dirname, 'zeroJS.html'),
        noHead: resolve(__dirname, 'noHead.html'),
        noBody: resolve(__dirname, 'noBody.html'),
        inlinea: resolve(__dirname, 'inline/shared_a.html'),
        inline1: resolve(__dirname, 'inline/shared-1.html'),
        inline2: resolve(__dirname, 'inline/shared-2.html'),
        inline3: resolve(__dirname, 'inline/unique.html'),
        unicodePath: resolve(
          __dirname,
          'unicode-path/中文-にほんご-한글-🌕🌖🌗/index.html'
        ),
        linkProps: resolve(__dirname, 'link-props/index.html'),
        valid: resolve(__dirname, 'valid.html')
      }
    }
  },

  plugins: [
    {
      name: 'pre-transform',
      transformIndexHtml: {
        order: 'pre',
        handler(html, { filename }) {
          if (html.includes('/@vite/client')) {
            throw new Error('pre transform applied at wrong time!')
          }
          const head = `
  <head lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
  </head>`
          return `<!DOCTYPE html>
<html lang="en">${filename.includes('noHead') ? '' : head}
${
  filename.includes('noBody')
    ? html
    : `<body>
  ${html}
</body>`
}
</html>
  `
        }
      }
    },
    {
      name: 'string-transform',
      transformIndexHtml(html) {
        return html.replace('Hello', 'Transformed')
      }
    },
    {
      name: 'tags-transform',
      transformIndexHtml() {
        return [
          {
            tag: 'meta',
            attrs: { name: 'description', content: 'a vite app' }
            // default injection is head-prepend
          },
          {
            tag: 'meta',
            attrs: { name: 'keywords', content: 'es modules' },
            injectTo: 'head'
          }
        ]
      }
    },
    {
      name: 'combined-transform',
      transformIndexHtml(html) {
        return {
          html: html.replace('{{ title }}', 'Test HTML transforms'),
          tags: [
            {
              tag: 'p',
              attrs: { class: 'inject' },
              children: 'This is injected',
              injectTo: 'body'
            }
          ]
        }
      }
    },
    {
      name: 'serve-only-transform',
      transformIndexHtml(_, ctx) {
        if (ctx.server) {
          return [
            {
              tag: 'p',
              attrs: { class: 'server' },
              children: 'This is injected only during dev',
              injectTo: 'body'
            }
          ]
        }
      }
    },
    {
      name: 'build-only-transform',
      transformIndexHtml(_, ctx) {
        if (ctx.bundle) {
          return [
            {
              tag: 'p',
              attrs: { class: 'build' },
              children: 'This is injected only during build',
              injectTo: 'body'
            }
          ]
        }
      }
    },
    {
      name: 'path-conditional-transform',
      transformIndexHtml(_, ctx) {
        if (ctx.path.includes('nested')) {
          return [
            {
              tag: 'p',
              attrs: { class: 'conditional' },
              children: 'This is injected only for /nested/index.html',
              injectTo: 'body'
            }
          ]
        }
      }
    },
    {
      name: 'body-prepend-transform',
      transformIndexHtml() {
        return [
          {
            tag: 'noscript',
            children: '<!-- this is appended to body -->',
            injectTo: 'body'
          },
          {
            tag: 'noscript',
            children: '<!-- this is prepended to body -->',
            injectTo: 'body-prepend'
          }
        ]
      }
    },
    {
      name: 'head-prepend-importmap',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'importmap' },
            children: `
              {
                "imports": {
                  "vue": "https://unpkg.com/vue@3.2.0/dist/vue.runtime.esm-browser.js"
                }
              }
            `,
            injectTo: 'head'
          }
        ]
      }
    }
  ]
}

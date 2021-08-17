import path from 'path'
import { Plugin } from 'vite'
import { markdownToVue } from './markdownToVue'
// import { APP_PATH } from './alias'
import createVuePlugin from '@vitejs/plugin-vue'

export const APP_PATH = path.join(__dirname, '../client/app')
export const DEFAULT_THEME_PATH = path.join(
  __dirname,
  '../client/theme-default'
)

const virtualFileId = '@my-virtual-file'

export function createVitePressPlugin(
  root: string,
): Plugin[] {

  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/]
  })

  const vitePressPlugin: Plugin = {
    name: 'vitepress',

    // config() {
    //   return {
    //     transformInclude: /\.md$/,
    //   }
    // },

    resolveId(id) {
      console.log('resolveId id', id)
      if (id === virtualFileId) {
        return virtualFileId
      }

    },

    load(id) {
      console.log('load id', id)
      if (id === virtualFileId) {
        return `export const msg = "from virtual file"`
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        console.log('transform code', code)
        // transform .md files into vueSrc so plugin-vue can handle it
        return markdownToVue(code)
      }
    },

    configureServer(server) {
      // serve our index.html after vite history fallback
      return () => {
        // @ts-ignore
        server.app.use((req, res, next) => {
          if (req.url!.endsWith('.html')) {
            res.statusCode = 200
            res.end(
              `<div id="app"></div>\n` +
                `<script type="module" src="/@fs/${APP_PATH}/index.js"></script>`
            )
            return
          }
          next()
        })
      }
    },
  }

  return [vitePressPlugin, vuePlugin]
}

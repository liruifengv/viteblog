import {   
  createApp as createClientApp,
  h,
  inject,
  watchEffect,
  shallowRef } from 'vue'
import { Layout } from '../theme-default/index'

const NotFound = (() => '404 Not Found')

const VitePressApp = {
  name: 'VitePressApp',
  setup() {
    return () => h(Layout)
  }
}
const PathSymbol = Symbol()

export function createApp() {

  const app = newApp()

  return { app }
}

const Content = {
  setup() {
    const path: any = inject(PathSymbol)
    const comp = shallowRef()

    watchEffect(() => {
      let pagePath: string = path.value.replace(/\.html$/, '')
      if (pagePath.endsWith('/')) {
        pagePath += 'index.md'
      } else {
        pagePath += '.md'
      }

      import(pagePath)
        .then((m) => {
          comp.value = m.default
        })
        .catch(err => {
          comp.value = NotFound
        })
    })

    return () => (comp.value ? h(comp.value) : null)
  }
}

function newApp() {
  return createClientApp(VitePressApp)
}

const { app } = createApp()

app.component('Content', Content)

app.mount('#app')

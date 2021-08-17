import { createServer as createViteServer, ServerOptions } from 'vite'
import { createVitePressPlugin } from './plugin'

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  console.log('createViteServer root:', root)
  return createViteServer({
    root,
    plugins: createVitePressPlugin(root),
    server: serverOptions,
  })
}
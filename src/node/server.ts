import { createServer as createViteServer, ServerOptions } from 'vite'

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  return createViteServer({
    root: 'src/client/',
    server: serverOptions
  })
}
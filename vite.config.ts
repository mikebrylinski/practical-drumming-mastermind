import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn, type ChildProcess } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'

function getFreePort(start: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const srv = net.createServer()
      srv.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') tryPort(port + 1)
        else reject(err)
      })
      srv.once('listening', () => srv.close(() => resolve(port)))
      srv.listen(port, '127.0.0.1')
    }
    tryPort(start)
  })
}

// Dev-only: pick a free port for the local Express API, point the Vite proxy at
// it, and run the API as a child process Vite owns. This guarantees the proxy
// always follows the API port and that no stale API server is left behind.
function apiServer(): PluginOption {
  let apiPort = Number(process.env.API_PORT) || 3003
  let child: ChildProcess | undefined
  let restartTimer: ReturnType<typeof setTimeout> | undefined

  function kill() {
    if (child && !child.killed) {
      child.kill()
    }
    child = undefined
  }

  function start() {
    kill()
    child = spawn(
      process.execPath,
      ['--env-file-if-exists=.env', 'server/index.js'],
      { stdio: 'inherit', env: { ...process.env, API_PORT: String(apiPort) } },
    )
  }

  return {
    name: 'pdm-api-server',
    apply: 'serve',
    async config() {
      apiPort = await getFreePort(Number(process.env.API_PORT) || 3003)
      return {
        server: {
          proxy: {
            '/api': { target: `http://localhost:${apiPort}`, changeOrigin: true },
          },
        },
      }
    },
    configureServer(server) {
      start()

      // Express does not hot-reload; restart when server/api handlers change.
      const watchRoots = [
        path.resolve('server'),
        path.resolve('api'),
      ]
      server.watcher.add(watchRoots)
      server.watcher.on('change', (file) => {
        const abs = path.resolve(file)
        if (!watchRoots.some((root) => abs.startsWith(root + path.sep) || abs === root)) {
          return
        }
        if (restartTimer) clearTimeout(restartTimer)
        restartTimer = setTimeout(() => {
          console.log(`[api] restarting after change: ${path.relative(process.cwd(), abs)}`)
          start()
        }, 200)
      })

      server.httpServer?.once('close', kill)
      process.once('exit', kill)
      process.once('SIGINT', () => {
        kill()
        process.exit()
      })
      process.once('SIGTERM', () => {
        kill()
        process.exit()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiServer()],
})

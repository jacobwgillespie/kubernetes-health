import http from 'http'
import https from 'https'
import {Socket} from 'net'
import {TLSSocket} from 'tls'
import {Task} from './Health'
import {sleep} from './_utils'

export function gracefulHttpTerminatorTask(
  server: http.Server | https.Server,
  terminationGracePeriodSeconds = 1,
): Task {
  const isHTTPS = server instanceof https.Server
  let isTerminating = false

  const trackedSockets = new Set<Socket>()

  server.on('connection', (socket: Socket) => {
    if (isTerminating) return socket.destroy()
    trackedSockets.add(socket)
    socket.once('close', () => trackedSockets.delete(socket))
  })

  server.on('secureConnection', (socket: TLSSocket) => {
    if (isTerminating) return socket.destroy()
    trackedSockets.add(socket)
    socket.once('close', () => trackedSockets.delete(socket))
  })

  const destroySocket = (socket: Socket) => {
    socket.destroy()
    trackedSockets.delete(socket)
  }

  return async () => {
    if (isTerminating) return
    isTerminating = true

    server.on('request', (_: http.IncomingMessage, res: http.ServerResponse) => {
      if (!res.headersSent) {
        res.setHeader('connection', 'close')
      }
    })

    for (const socket of trackedSockets) {
      if (isHTTPS && !(socket instanceof TLSSocket)) continue

      const res: http.ServerResponse = (socket as any)._httpMessage
      if (!res) destroySocket(socket)
      else if (!res.headersSent) res.setHeader('connection', 'close')
    }

    if (trackedSockets.size > 0) {
      await sleep(terminationGracePeriodSeconds * 1000)
      for (const socket of trackedSockets) destroySocket(socket)
    }

    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

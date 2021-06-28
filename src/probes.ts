import http from 'http'
import {URL} from 'url'
import {Health} from './Health'

/**
 * A probe listener for the liveness or readiness status of the application. Supports Express, Connect,
 * Fastify, Koa, and `http.Server`.
 */
export interface ProbeListener {
  (ctx: {res: http.ServerResponse}): void
  (req: any, res: http.ServerResponse): void
  (req: any, res: {raw: http.ServerResponse}): void
}

function requestListenerToProbeListener(requestListener: http.RequestListener): ProbeListener {
  const probeListener: ProbeListener = ((req: {res: http.ServerResponse} | void, res) => {
    // http.Server, Express, Connect
    if (res instanceof http.ServerResponse) {
      return requestListener({} as any, res)
    }

    // Fastify
    if ('raw' in res && res.raw instanceof http.ServerResponse) {
      return requestListener({} as any, res.raw)
    }

    // Koa
    if (req && 'res' in req && req.res instanceof http.ServerResponse) {
      return requestListener({} as any, req.res)
    }
  }) as ProbeListener
  return probeListener
}

/**
 * Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is live, and 500 otherwise.
 *
 * @param health the `Health` instance
 * @returns an `ProbeListener`
 */
export function createLivenessProbeListener(health: Health): ProbeListener {
  return requestListenerToProbeListener((_, res) => {
    if (health.isLive) {
      res.statusCode = 200
      res.end('live')
    } else {
      res.statusCode = 500
      res.end('not live')
    }
  })
}

/**
 * Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is ready, and 500 otherwise.
 *
 * @param health the `Health` instance
 * @returns an `ProbeListener`
 */
export function createReadinessProbeListener(health: Health): ProbeListener {
  return requestListenerToProbeListener((_, res) => {
    if (health.isReady) {
      res.statusCode = 200
      res.end('ready')
    } else {
      res.statusCode = 500
      res.end('not ready')
    }
  })
}

/**
 * Options for the health probe server
 */
export interface ProbeServerOptions {
  /**
   * Pathname of the liveness endpoint
   *
   * @default '/healthz'
   */
  livenessEndpoint?: string

  /**
   * Pathname of the readiness endpoint
   *
   * @default '/readyz'
   */
  readinessEndpoint?: string
}

/**
 * Creates a new `http.Server` configured to serve the liveness and readiness endpoints for a given Health instance.
 *
 * @param health the `Health` instance to serve
 * @param options options for the health probe server
 * @returns an `http.Server` ready to serve the health probes
 */
export function createProbeServer(health: Health, options: ProbeServerOptions = {}): http.Server {
  const {livenessEndpoint = '/healthz', readinessEndpoint = '/readyz'} = options
  const livenessListener = createLivenessProbeListener(health)
  const readinessListener = createReadinessProbeListener(health)
  return http.createServer((req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    if (url.pathname === livenessEndpoint) return livenessListener(req, res)
    if (url.pathname === readinessEndpoint) return readinessListener(req, res)
    res.statusCode = 404
    res.end('not found')
  })
}

/**
 * Create and start a health probe server, listening on on the specified port / hostname.
 *
 * @param health the `Health` instance to serve
 * @param options options for the health probe server
 * @param port port to listen on (default: `4000`)
 * @param hostname hostname to listen on (default: all hostnames)
 */
export function startProbeServer(health: Health, options: ProbeServerOptions = {}, port = 4000, hostname?: string) {
  const server = createProbeServer(health, options)
  server.listen(port, hostname)
}

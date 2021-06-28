import http from 'http'
import {URL} from 'url'
import {Health} from './Health'

/**
 * Creates a new `http.RequestListener` that returns 200 if the specified `Health` instance is live, and 500 otherwise.
 *
 * @param health the `Health` instance
 * @returns an `http.RequestListener`
 */
export function createLivenessProbeListener(health: Health): http.RequestListener {
  return (_, res) => {
    if (health.isLive) {
      res.statusCode = 200
      res.end('live')
    } else {
      res.statusCode = 500
      res.end('not live')
    }
  }
}

/**
 * Creates a new `http.RequestListener` that returns 200 if the specified `Health` instance is ready, and 500 otherwise.
 *
 * @param health the `Health` instance
 * @returns an `http.RequestListener`
 */
export function createReadinessProbeListener(health: Health): http.RequestListener {
  return (_, res) => {
    if (health.isReady) {
      res.statusCode = 200
      res.end('ready')
    } else {
      res.statusCode = 500
      res.end('not ready')
    }
  }
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

# kubernetes-health

[![CI](https://github.com/jacobwgillespie/kubernetes-health/actions/workflows/ci.yml/badge.svg)](https://github.com/jacobwgillespie/kubernetes-health/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/kubernetes-health.svg)](https://www.npmjs.com/package/kubernetes-health)
![Powered by TypeScript](https://img.shields.io/badge/powered%20by-typescript-blue.svg)

A helper library for implementing Kubernetes heath checks and graceful HTTP shutdown in Node applications.

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
  - [Standalone Health Server](#standalone-health-server)
  - [Express](#express)
- [License](#license)

## Installation

Install using your preferred package manager:

```bash
$ yarn add kubernetes-health
$ pnpm add kubernetes-health
$ npm install kubernetes-health
```

## Usage

`kubernetes-health` supports many different configuration options, can integrate with existing HTTP frameworks, can run tasks on termination, and and can gracefully handle in-flight HTTP requests. See below for more details.

To get started:

1. First, create a new `Health` instance to track your application health:

   ```typescript
   import {Health} from 'kubernetes-health'

   const health = new Health()
   ```

2. Then once your application is ready to receive requests, mark its status as ready:

   ```typescript
   health.markReady()
   ```

3. You will need to expose this health status to Kubernetes via an HTTP endpoint, the easiest way to do this is to start a standalone health server with `startProbeServer()`:

   ```typescript
   import {startProbeServer} from 'kubernetes-health'

   startProbeServer(health)
   ```

   This will serve the endpoints `/healthz` and `/readyz` on port 4000 (all configurable, see below). These endpoints can thus be referenced from the liveness, readiness, and startup probes.

## API

[Read the API documentation.](./docs/modules.md)

## Examples

### Standalone Health Server

To serve a standard Node `http.Server` for the liveness and readiness endpoints:

```typescript
import {Health, startProbeServer} from 'kubernetes-health'
const health = new Health()

startProbeServer(health)
```

To create a new Node `http.Server`, but not automatically listen:

```typescript
import {Health, createProbeServer} from 'kubernetes-health'
const health = new Health()

const server = createProbeServer(health)
```

### Express

To mark the application as ready when the server is listening, and gracefully handle in-flight requests during termination:

```typescript
import {Health, gracefulHttpTerminatorTask} from 'kubernetes-health'
import express from 'express'

const health = new Health()
const app = express()

// ...

const server = app.listen(3000, () => {
  health.markReady()
})

health.beforeTermination(gracefulHttpTerminatorTask(server))
```

To integrate the liveness and readiness endpoints into an existing Express application:

```typescript
import {Health, createLivenessProbeListener, createReadinessProbeListener} from 'kubernetes-health'
import express from 'express'

const health = new Health()
const app = express()

app.get('/healthz', createLivenessProbeListener(health))
app.get('/readyz', createReadinessProbeListener(health))
```

## License

MIT License, see `LICENSE`.

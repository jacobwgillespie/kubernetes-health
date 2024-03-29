# Interface: ProbeServerOptions

Options for the health probe server

## Table of contents

### Properties

- [livenessEndpoint](ProbeServerOptions.md#livenessendpoint)
- [readinessEndpoint](ProbeServerOptions.md#readinessendpoint)

## Properties

### livenessEndpoint

• `Optional` **livenessEndpoint**: `string`

Pathname of the liveness endpoint

**`default`** '/healthz'

#### Defined in

[probes.ts:80](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L80)

---

### readinessEndpoint

• `Optional` **readinessEndpoint**: `string`

Pathname of the readiness endpoint

**`default`** '/readyz'

#### Defined in

[probes.ts:87](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L87)

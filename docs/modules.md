# @k8ts/health

## Table of contents

### Classes

- [Health](classes/health.md)

### Interfaces

- [Options](interfaces/options.md)
- [PendingTask](interfaces/pendingtask.md)
- [ProbeListener](interfaces/probelistener.md)
- [ProbeServerOptions](interfaces/probeserveroptions.md)

### Type aliases

- [Status](modules.md#status)
- [Task](modules.md#task)

### Variables

- [defaultOptions](modules.md#defaultoptions)

### Functions

- [createLivenessProbeListener](modules.md#createlivenessprobelistener)
- [createProbeServer](modules.md#createprobeserver)
- [createReadinessProbeListener](modules.md#createreadinessprobelistener)
- [gracefulHttpTerminatorTask](modules.md#gracefulhttpterminatortask)
- [startProbeServer](modules.md#startprobeserver)

## Type aliases

### Status

Ƭ **Status**: ``"Pending"`` \| ``"Live"`` \| ``"Ready"`` \| ``"NotReady"`` \| ``"Terminating"``

#### Defined in

[Health.ts:4](https://github.com/k8ts/health/blob/main/src/Health.ts#L4)

___

### Task

Ƭ **Task**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

#### Defined in

[Health.ts:6](https://github.com/k8ts/health/blob/main/src/Health.ts#L6)

## Variables

### defaultOptions

• `Const` **defaultOptions**: [`Options`](interfaces/options.md)

Default values for Health options, if not specified

#### Defined in

[Health.ts:49](https://github.com/k8ts/health/blob/main/src/Health.ts#L49)

## Functions

### createLivenessProbeListener

▸ **createLivenessProbeListener**(`health`): [`ProbeListener`](interfaces/probelistener.md)

Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is live, and 500 otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `health` | [`Health`](classes/health.md) | the `Health` instance |

#### Returns

[`ProbeListener`](interfaces/probelistener.md)

an `ProbeListener`

#### Defined in

[probes.ts:41](https://github.com/k8ts/health/blob/main/src/probes.ts#L41)

___

### createProbeServer

▸ **createProbeServer**(`health`, `options?`): `http.Server`

Creates a new `http.Server` configured to serve the liveness and readiness endpoints for a given Health instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `health` | [`Health`](classes/health.md) | the `Health` instance to serve |
| `options` | [`ProbeServerOptions`](interfaces/probeserveroptions.md) | options for the health probe server |

#### Returns

`http.Server`

an `http.Server` ready to serve the health probes

#### Defined in

[probes.ts:97](https://github.com/k8ts/health/blob/main/src/probes.ts#L97)

___

### createReadinessProbeListener

▸ **createReadinessProbeListener**(`health`): [`ProbeListener`](interfaces/probelistener.md)

Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is ready, and 500 otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `health` | [`Health`](classes/health.md) | the `Health` instance |

#### Returns

[`ProbeListener`](interfaces/probelistener.md)

an `ProbeListener`

#### Defined in

[probes.ts:59](https://github.com/k8ts/health/blob/main/src/probes.ts#L59)

___

### gracefulHttpTerminatorTask

▸ **gracefulHttpTerminatorTask**(`server`, `terminationGracePeriodSeconds?`): [`Task`](modules.md#task)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `server` | `http.Server` \| `https.Server` | `undefined` |
| `terminationGracePeriodSeconds` | `number` | `1` |

#### Returns

[`Task`](modules.md#task)

#### Defined in

[graceful.ts:8](https://github.com/k8ts/health/blob/main/src/graceful.ts#L8)

___

### startProbeServer

▸ **startProbeServer**(`health`, `options?`, `port?`, `hostname?`): `http.Server`

Create and start a health probe server, listening on on the specified port / hostname.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `health` | [`Health`](classes/health.md) | `undefined` | the `Health` instance to serve |
| `options` | [`ProbeServerOptions`](interfaces/probeserveroptions.md) | `{}` | options for the health probe server |
| `port` | `number` | `4000` | port to listen on (default: `4000`) |
| `hostname?` | `string` | `undefined` | hostname to listen on (default: all hostnames) |

#### Returns

`http.Server`

#### Defined in

[probes.ts:118](https://github.com/k8ts/health/blob/main/src/probes.ts#L118)

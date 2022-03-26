# kubernetes-health

## Table of contents

### Classes

- [Health](classes/Health.md)

### Interfaces

- [Options](interfaces/Options.md)
- [PendingTask](interfaces/PendingTask.md)
- [ProbeListener](interfaces/ProbeListener.md)
- [ProbeServerListenOptions](interfaces/ProbeServerListenOptions.md)
- [ProbeServerOptions](interfaces/ProbeServerOptions.md)

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

Ƭ **Status**: `"Pending"` \| `"Live"` \| `"Ready"` \| `"NotReady"` \| `"Terminating"`

#### Defined in

[Health.ts:4](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L4)

---

### Task

Ƭ **Task**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

#### Defined in

[Health.ts:6](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L6)

## Variables

### defaultOptions

• `Const` **defaultOptions**: [`Options`](interfaces/Options.md)

Default values for Health options, if not specified

#### Defined in

[Health.ts:49](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L49)

## Functions

### createLivenessProbeListener

▸ **createLivenessProbeListener**(`health`): [`ProbeListener`](interfaces/ProbeListener.md)

Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is live, and 500 otherwise.

#### Parameters

| Name     | Type                          | Description           |
| :------- | :---------------------------- | :-------------------- |
| `health` | [`Health`](classes/Health.md) | the `Health` instance |

#### Returns

[`ProbeListener`](interfaces/ProbeListener.md)

an `ProbeListener`

#### Defined in

[probes.ts:41](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L41)

---

### createProbeServer

▸ **createProbeServer**(`health`, `options?`): `http.Server`

Creates a new `http.Server` configured to serve the liveness and readiness endpoints for a given Health instance.

#### Parameters

| Name      | Type                                                     | Description                         |
| :-------- | :------------------------------------------------------- | :---------------------------------- |
| `health`  | [`Health`](classes/Health.md)                            | the `Health` instance to serve      |
| `options` | [`ProbeServerOptions`](interfaces/ProbeServerOptions.md) | options for the health probe server |

#### Returns

`http.Server`

an `http.Server` ready to serve the health probes

#### Defined in

[probes.ts:97](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L97)

---

### createReadinessProbeListener

▸ **createReadinessProbeListener**(`health`): [`ProbeListener`](interfaces/ProbeListener.md)

Creates a new `ProbeListener` that returns 200 if the specified `Health` instance is ready, and 500 otherwise.

#### Parameters

| Name     | Type                          | Description           |
| :------- | :---------------------------- | :-------------------- |
| `health` | [`Health`](classes/Health.md) | the `Health` instance |

#### Returns

[`ProbeListener`](interfaces/ProbeListener.md)

an `ProbeListener`

#### Defined in

[probes.ts:59](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L59)

---

### gracefulHttpTerminatorTask

▸ **gracefulHttpTerminatorTask**(`server`, `terminationGracePeriodSeconds?`): [`Task`](modules.md#task)

#### Parameters

| Name                            | Type                 | Default value |
| :------------------------------ | :------------------- | :------------ |
| `server`                        | `Server` \| `Server` | `undefined`   |
| `terminationGracePeriodSeconds` | `number`             | `1`           |

#### Returns

[`Task`](modules.md#task)

#### Defined in

[graceful.ts:8](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/graceful.ts#L8)

---

### startProbeServer

▸ **startProbeServer**(`health`, `options?`): `http.Server`

Create and start a health probe server, listening on on the specified port / hostname.

#### Parameters

| Name      | Type                                                                                                                            | Description                         |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------- |
| `health`  | [`Health`](classes/Health.md)                                                                                                   | the `Health` instance to serve      |
| `options` | [`ProbeServerOptions`](interfaces/ProbeServerOptions.md) & [`ProbeServerListenOptions`](interfaces/ProbeServerListenOptions.md) | options for the health probe server |

#### Returns

`http.Server`

#### Defined in

[probes.ts:132](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L132)

# Class: Health

The `Health` class represents the health status if an application. It manages transitions between application
state, and automatically registers shutdown handlers to that run when the process receives a shutdown signal.

## Table of contents

### Constructors

- [constructor](health.md#constructor)

### Accessors

- [isLive](health.md#islive)
- [isReady](health.md#isready)
- [status](health.md#status)

### Methods

- [beforeLive](health.md#beforelive)
- [beforeReady](health.md#beforeready)
- [beforeTermination](health.md#beforetermination)
- [createPendingTask](health.md#creatependingtask)
- [markNotReady](health.md#marknotready)
- [markReady](health.md#markready)
- [shutdown](health.md#shutdown)

## Constructors

### constructor

• **new Health**(`options`)

#### Parameters

| Name      | Type                                              |
| :-------- | :------------------------------------------------ |
| `options` | `Partial`<[`Options`](../interfaces/options.md)\> |

#### Defined in

[Health.ts:101](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L101)

## Accessors

### isLive

• `get` **isLive**(): `boolean`

`true` if the application is live, `false` otherwise

#### Returns

`boolean`

#### Defined in

[Health.ts:75](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L75)

---

### isReady

• `get` **isReady**(): `boolean`

`true` if the application is ready, `false` otherwise

#### Returns

`boolean`

#### Defined in

[Health.ts:82](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L82)

---

### status

• `get` **status**(): [`Status`](../modules.md#status)

The overall application status, transitions between the following status states:

- `Pending`
- `Live`
- `Ready`
- `NotReady`
- `Terminating`

#### Returns

[`Status`](../modules.md#status)

#### Defined in

[Health.ts:95](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L95)

## Methods

### beforeLive

▸ **beforeLive**(`task`): `void`

Add (register) a task that must complete before the application is considered live

#### Parameters

| Name   | Type                         | Description         |
| :----- | :--------------------------- | :------------------ |
| `task` | [`Task`](../modules.md#task) | the task to execute |

#### Returns

`void`

#### Defined in

[Health.ts:118](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L118)

---

### beforeReady

▸ **beforeReady**(`task`): `void`

Add (register) a task that must complete before the application is considered ready

#### Parameters

| Name   | Type                         | Description         |
| :----- | :--------------------------- | :------------------ |
| `task` | [`Task`](../modules.md#task) | the task to execute |

#### Returns

`void`

#### Defined in

[Health.ts:130](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L130)

---

### beforeTermination

▸ **beforeTermination**(`handler`): `void`

Add (register) a task that must complete before the application terminates

#### Parameters

| Name      | Type                         |
| :-------- | :--------------------------- |
| `handler` | [`Task`](../modules.md#task) |

#### Returns

`void`

#### Defined in

[Health.ts:142](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L142)

---

### createPendingTask

▸ **createPendingTask**(): [`PendingTask`](../interfaces/pendingtask.md)

Create a new pending task that must be completed before the process terminates.

#### Returns

[`PendingTask`](../interfaces/pendingtask.md)

a `PendingTask` that can be marked as completed

#### Defined in

[Health.ts:151](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L151)

---

### markNotReady

▸ **markNotReady**(): `void`

Mark the health instance as not ready

#### Returns

`void`

#### Defined in

[Health.ts:176](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L176)

---

### markReady

▸ **markReady**(): `void`

Mark the health instance as ready

#### Returns

`void`

#### Defined in

[Health.ts:168](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L168)

---

### shutdown

▸ **shutdown**(): `Promise`<`void`\>

Signals that the process should shut down. Waits for any pending tasks and triggers all shutdown handlers.
If a `terminationGracePeriodSeconds` is defined, the process will be forcibly terminated after that amount
of time if it does not gracefully exit before then.

#### Returns

`Promise`<`void`\>

#### Defined in

[Health.ts:186](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/Health.ts#L186)

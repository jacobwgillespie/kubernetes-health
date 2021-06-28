# Interface: Options

Options for the `Health` instance

## Table of contents

### Properties

- [forciblyTerminate](options.md#forciblyterminate)
- [shutdownDelaySeconds](options.md#shutdowndelayseconds)
- [shutdownSignals](options.md#shutdownsignals)
- [terminationGracePeriodSeconds](options.md#terminationgraceperiodseconds)

## Properties

### forciblyTerminate

• **forciblyTerminate**: () => `void`

#### Type declaration

▸ (): `void`

Function called to forcibly terminate the current process

##### Returns

`void`

#### Defined in

[Health.ts:21](https://github.com/k8ts/health/blob/main/src/Health.ts#L21)

---

### shutdownDelaySeconds

• **shutdownDelaySeconds**: `number`

The amount of time to wait before starting to shut down. There is often a delay between when Kubernetes informs
the pod that it will be terminating and when all network requests to that pod have ceased, so this delay ensures
that in-flight requests are not rejected. Set to a number less than or equal to `0` to disable.

**`default`** 5

#### Defined in

[Health.ts:30](https://github.com/k8ts/health/blob/main/src/Health.ts#L30)

---

### shutdownSignals

• **shutdownSignals**: `Signals`[]

Signals that trigger application shutdown.

**`default`** ['SIGTERM', 'SIGHUP', 'SIGINT']

#### Defined in

[Health.ts:37](https://github.com/k8ts/health/blob/main/src/Health.ts#L37)

---

### terminationGracePeriodSeconds

• **terminationGracePeriodSeconds**: `number`

The amount of time, in seconds, before the process is forcibly terminated after shutdown is initiated. Set to a
value less than or equal to `0` to disable.

**`default`** 30

#### Defined in

[Health.ts:45](https://github.com/k8ts/health/blob/main/src/Health.ts#L45)

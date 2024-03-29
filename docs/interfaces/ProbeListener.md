# Interface: ProbeListener

## Callable

### ProbeListener

▸ **ProbeListener**(`ctx`): `void`

A probe listener for the liveness or readiness status of the application. Supports Express, Connect,
Fastify, Koa, and `http.Server`.

#### Parameters

| Name      | Type             |
| :-------- | :--------------- |
| `ctx`     | `Object`         |
| `ctx.res` | `ServerResponse` |

#### Returns

`void`

#### Defined in

[probes.ts:10](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L10)

### ProbeListener

▸ **ProbeListener**(`req`, `res`): `void`

A probe listener for the liveness or readiness status of the application. Supports Express, Connect,
Fastify, Koa, and `http.Server`.

#### Parameters

| Name  | Type             |
| :---- | :--------------- |
| `req` | `any`            |
| `res` | `ServerResponse` |

#### Returns

`void`

#### Defined in

[probes.ts:11](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L11)

### ProbeListener

▸ **ProbeListener**(`req`, `res`): `void`

A probe listener for the liveness or readiness status of the application. Supports Express, Connect,
Fastify, Koa, and `http.Server`.

#### Parameters

| Name      | Type             |
| :-------- | :--------------- |
| `req`     | `any`            |
| `res`     | `Object`         |
| `res.raw` | `ServerResponse` |

#### Returns

`void`

#### Defined in

[probes.ts:12](https://github.com/jacobwgillespie/kubernetes-health/blob/main/src/probes.ts#L12)

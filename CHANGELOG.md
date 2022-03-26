# Changelog

## v1.0.0 - 2022-03-26

- Don't report `live: false` on shutdown (will case Kubernetes to SIGKILL the pod), do report `ready: false` on shutdown (to be taken out of the service rotation)
- Renamed package to `kubernetes-health`
- Updated all dependencies

## v0.1.1 - 2021-06-28

- Update `package.json` metadata

## v0.1.0 - 2021-06-28

- Initial release

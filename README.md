# cache-redis

[![NPM version][npm-img]][npm]
[![Node.js CI][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]
[![Snyk badge][snyk-img]][snyk]

[npm-img]:         https://img.shields.io/npm/v/@tadashi/cache-redis.svg
[npm]:             https://www.npmjs.com/package/@tadashi/cache-redis
[ci-img]:          https://github.com/lagden/cache-redis/actions/workflows/nodejs.yml/badge.svg
[ci]:              https://github.com/lagden/cache-redis/actions/workflows/nodejs.yml
[coveralls-img]:   https://coveralls.io/repos/github/lagden/cache-redis/badge.svg?branch=main
[coveralls]:       https://coveralls.io/github/lagden/cache-redis?branch=main
[snyk-img]:        https://snyk.io/test/github/lagden/cache-redis/badge.svg
[snyk]:            https://snyk.io/test/github/lagden/cache-redis


Making cache with Redis


## Install

```
$ npm i @tadashi/cache-redis
```


## API

### new Cache( \[opts\])

| parameter | type        | required | default            | description       |
| --------- | ----------- | -------- | ------------------ | ----------------- |
| opts      | Object      | no       | [see below](#opts) | Options for configuring the cache. |


#### opts

| parameter      | type             | required | default        | description                             |
| -------------- | ---------------- | -------- | -------------- | --------------------------------------- |
| address        | String\|String[] | no       | 127.0.0.1:6379 | The address of the Redis server.        |
| namespace      | String           | no       | app            | A namespace for the cache keys.         |
| redisOptions   | Object           | no       | -              | [See configuration options](https://redis.github.io/ioredis/interfaces/CommonRedisOptions.html) |


### Cluster

To use `Cluster`, set addresses separated by commas or an array and set [clusterOptions](https://redis.github.io/ioredis/interfaces/ClusterOptions.html).

```js
import Cache from '@tadashi/cache-redis'

const cache = new Cache({
  address: '127.0.0.1:6379, 127.0.0.1:6380, 127.0.0.1:6381',
  // or
  address: ['127.0.0.1:6379', '127.0.0.1:6380', '127.0.0.1:6381'],
  // and
  redisOptions: {
    clusterOptions: {
      retryDelayOnClusterDown: 500,
      // ...
    }
  }
})
```


## Usage

```js
import Cache from '@tadashi/cache-redis'

const _cache = new Cache({
  redisOptions: {
    keyPrefix: 'api'
  },
  namespace: 'example'
})

async function find(key) {
  try {
    const cache = await _cache.get(key)
    if (cache) {
      return cache
    }
    const result = await getDataFromSomeWhere(key)
    await _cache.set(key, result, 'PX', 3600)
    return result
  } catch (err) {
    throw err
  }
}


await find('foo')
// => data from getDataFromSomeWhere

await find('foo')
// => data from cache
```

---

> [!IMPORTANT]  
> Buy me a coffee!  
> BTC: `bc1q7famhuj5f25n6qvlm3sssnymk2qpxrfwpyq7g4`


## License

MIT © [Thiago Lagden](https://github.com/lagden)

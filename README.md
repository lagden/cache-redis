# cache-redis

[![NPM version][npm-img]][npm]
[![Node.js CI][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]

[![XO code style][xo-img]][xo]
[![Snyk badge][snyk-img]][snyk]

[npm-img]:         https://img.shields.io/npm/v/@tadashi/cache-redis.svg
[npm]:             https://www.npmjs.com/package/@tadashi/cache-redis
[ci-img]:          https://github.com/lagden/cache-redis/workflows/Node.js%20CI/badge.svg
[ci]:              https://github.com/lagden/cache-redis/actions?query=workflow%3A%22Node.js+CI%22
[coveralls-img]:   https://coveralls.io/repos/github/lagden/cache-redis/badge.svg?branch=master
[coveralls]:       https://coveralls.io/github/lagden/cache-redis?branch=master
[xo-img]:          https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:              https://github.com/sindresorhus/xo
[snyk-img]:        https://snyk.io/test/github/lagden/cache-redis/badge.svg
[snyk]:            https://snyk.io/test/github/lagden/cache-redis


Using Redis as cache


## Install

```
$ npm i -S @tadashi/cache-redis
```


## API

### new Cache( \[opts\])

Name        | Type                 | Default                            | Description
----------- | -------------------- | ---------------------------------- | ------------
opts        | object               | {namespace: 'cache', redis: {}}    | See bellow


#### opts.addresses:String

Addresses to connect (separated by commas)


#### opts.namespace:String

The namespace for all cache members


#### opts.redis:Object

See [ioredis](https://github.com/luin/ioredis/blob/master/API.md) options

---

### Cluster

To use `Redis.Cluster`, set addresses separated by commas:

```js
const cache = new Cache({addresses: '127.0.0.1:6379,127.0.0.1:6380,127.0.0.1:6381'})
```


## Usage

```js
import Cache from '@tadashi/cache-redis'

const _cache = new Cache({
  redis: {
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


## License

MIT © [Thiago Lagden](https://github.com/lagden)

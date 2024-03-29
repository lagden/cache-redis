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


Using Redis as cache


## Install

```
$ npm i @tadashi/cache-redis
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


## Donate ❤️

BTC: bc1q7famhuj5f25n6qvlm3sssnymk2qpxrfwpyq7g4


## License

MIT © [Thiago Lagden](https://github.com/lagden)

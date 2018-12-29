# cache-redis

[![NPM version][npm-img]][npm]
[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]
[![Dependency Status][dep-img]][dep]
[![devDependency Status][devDep-img]][devDep]

[![XO code style][xo-img]][xo]
[![Greenkeeper badge][greenkeeper-img]][greenkeeper]

[npm-img]:         https://img.shields.io/npm/v/@tadashi/cache-redis.svg
[npm]:             https://www.npmjs.com/package/@tadashi/cache-redis
[ci-img]:          https://travis-ci.org/lagden/cache-redis.svg
[ci]:              https://travis-ci.org/lagden/cache-redis
[coveralls-img]:   https://coveralls.io/repos/github/lagden/cache-redis/badge.svg?branch=master
[coveralls]:       https://coveralls.io/github/lagden/cache-redis?branch=master
[dep-img]:         https://david-dm.org/lagden/cache-redis.svg
[dep]:             https://david-dm.org/lagden/cache-redis
[devDep-img]:      https://david-dm.org/lagden/cache-redis/dev-status.svg
[devDep]:          https://david-dm.org/lagden/cache-redis#info=devDependencies
[xo-img]:          https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:              https://github.com/sindresorhus/xo
[greenkeeper-img]: https://badges.greenkeeper.io/lagden/cache-redis.svg
[greenkeeper]:     https://greenkeeper.io/


Using Redis as cache


## Install

```
$ npm i -S @tadashi/cache-redis
```


## API

### new Cache( \[opts\] \[, addresses \])

Name        | Type                 | Default                            | Description
----------- | -------------------- | ---------------------------------- | ------------
opts        | object               | {namespace: 'cache', redis: {}}    | See bellow
addresses   | string               | '127.0.0.1:6379'                   | Addresses to connect (separated by commas)


#### opts.namespace:String

The namespace is the key for all cache members

#### opts.redis:Object

It is the same configuration options of [ioredis](https://github.com/luin/ioredis/blob/master/API.md)

---

### Cluster

To use `Redis.Cluster`, set addresses separated by commas, example:

```js
const cache = new Cache({}, '127.0.0.1:6379,127.0.0.1:6380,127.0.0.1:6381')
```


## Usage

```js
'use strict'

const Cache = require('@tadashi/cache-redis')

const _cache = new Cache({
  redis: {
    keyPrefix: 'example'
  },
  namespace: 'api'
})

async function find(key) {
  try {
    const cache = await _cache.get(key)
    if (cache) {
      return cache
    }
    const result = await getDataFromSomeWhere(key)
    await _cache.set(key, result, 3600, 'PX')
    return result
  } catch (err) {
    throw err
  }
}

find('something').then(console.log)
// => data from getDataFromSomeWhere

find('something').then(console.log)
// => data from cache
```


## License

MIT © [Thiago Lagden](https://lagden.in)

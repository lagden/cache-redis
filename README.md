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


## Usage

The Redis options are the same of [ioredis](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options)

```js
'use strict'

const Cache = require('@tadashi/cache-redis')

const cache = new Cache({
  redis: {
    keyPrefix: 'chatuser'
  },
  namespace: 'api'
})

async function find(key) {
  try {
    const fromCache = await cache.get(key)
    if (fromCache) {
      return fromCache
    }
    const result = await getDataFromSomeWhere(key)
    await cache.set(key, result, 3600)
    return result
  } catch (err) {
    throw err
  }
}

find('lagden').then(console.log)
// => getDataFromSomeWhere

find('lagden').then(console.log)
// => fromCache
```


## License

MIT © [Thiago Lagden](http://lagden.in)

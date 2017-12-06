'use strict'

const JSONB = require('json-buffer')
const Redis = require('ioredis')

class Cache {
	constructor(opts = {}) {
		const options = Object.assign({}, {namespace: 'cache'}, opts)
		this.namespace = `namespace:${opts.namespace}`
		this.redis = new Redis(Object.assign({}, options.redis))
	}

	get(key) {
		return this.redis.get(key)
			.then(value => {
				value = JSONB.parse(value)
				if (value === undefined || value === null) {
					return undefined
				}
				return value
			})
	}

	set(key, value, ...more) {
		if (typeof value === 'undefined') {
			return Promise.resolve(undefined)
		}
		const [ttl, opt = 'EX'] = more
		let args = [key, JSONB.stringify(value)]
		if (typeof ttl === 'number' && (opt === 'EX' || opt === 'PX')) {
			args = [...args, opt, ttl]
		}
		return this.redis.set(...args)
			.then(() => this.redis.sadd(this.namespace, key))
	}

	delete(key) {
		return Promise.all([
			this.redis.del(key),
			this.redis.srem(this.namespace, key)
		])
		.then(([item]) => Boolean(item))
	}

	clear() {
		return this.redis.smembers(this.namespace)
			.then(keys => {
				const args = [...keys, this.namespace]
				return this.redis.del(...args)
			})
			.then(() => undefined)
	}
}

module.exports = Cache

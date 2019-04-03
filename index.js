'use strict'

const JSONB = require('json-buffer')
const connect = require('./lib/connect')

class Cache {
	constructor(opts = {}, addresses = undefined) {
		const options = {
			namespace: 'cache',
			redis: {},
			...opts
		}
		this.namespace = `namespace:${options.namespace}`
		this.redis = connect(addresses, options.redis)
	}

	async get(key) {
		let value = await this.redis.get(key)
		value = JSONB.parse(value)

		if (value === undefined || value === null) {
			return undefined
		}

		return value
	}

	async set(key, value, ...more) {
		if (typeof value === 'undefined') {
			return undefined
		}

		const [ttl, opt = 'EX'] = more
		let args = [key, JSONB.stringify(value)]

		if (typeof ttl === 'number' && (opt === 'EX' || opt === 'PX')) {
			args = [...args, opt, ttl]
		}

		await this.redis.set(...args)
		await this.redis.sadd(this.namespace, key)
	}

	async delete(key) {
		const [item] = await Promise.all([
			this.redis.del(key),
			this.redis.srem(this.namespace, key)
		])
		return Boolean(item)
	}

	async clear() {
		const keys = await this.redis.smembers(this.namespace)
		const args = [...keys, this.namespace]
		await this.redis.del(...args)
		return undefined
	}
}

module.exports = Cache

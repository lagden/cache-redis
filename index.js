'use strict'

const {compress, decompress} = require('@tadashi/jsonb')
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
		if (value === undefined || value === null) {
			return undefined
		}

		value = await decompress(value)
		return value
	}

	async set(key, value, expire, ttl) {
		if (typeof value === 'undefined') {
			return undefined
		}

		const _value = await compress(value)
		let args = [key, _value]

		if (typeof ttl === 'number' && (expire === 'EX' || expire === 'PX')) {
			args = [...args, expire, ttl]
		}

		const [[, set], [, sadd]] = await this.redis
			.multi()
			.set(...args)
			.sadd(this.namespace, key)
			.exec()

		return Boolean(set && sadd)
	}

	async delete(key) {
		const [[, del], [, srem]] = await this.redis
			.multi()
			.del(key)
			.srem(this.namespace, key)
			.exec()
		return Boolean(del && srem)
	}

	async clear() {
		const keys = await this.redis.smembers(this.namespace)
		const args = [...keys, this.namespace]
		await this.redis.del(...args)
		return undefined
	}
}

module.exports = Cache

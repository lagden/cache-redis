'use strict'

const {compress, decompress} = require('@tadashi/jsonb')
const connect = require('@tadashi/connect-redis')

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
		let value = await this.redis.getBuffer(key)
		if (value === undefined || value === null) {
			return undefined
		}

		value = await decompress(value)
		return value
	}

	async set(key, value, ...opts) {
		const [
			expire,
			ttl = 0
		] = opts
		if (typeof value === 'undefined') {
			return undefined
		}

		const _ttl = typeof ttl === 'number' ? ttl : Number(ttl)

		const _value = await compress(value, {base64: false})
		let args = [key, _value]

		if (expire === 'EX' || expire === 'PX') {
			args = [...args, expire, Number.isNaN(_ttl) ? 0 : _ttl]
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

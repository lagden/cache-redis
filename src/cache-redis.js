import { compress, decompress } from '@tadashi/jsonb'
import { connect } from '@tadashi/connect-redis'

/**
 * Class representing a cache using Redis with compression capabilities.
 */
class Cache {
	/**
	 * Create a cache instance.
	 *
	 * @param {Object} [opts={}] - Options for configuring the cache.
	 * @param {string} [opts.address] - The address of the Redis server.
	 * @param {string} [opts.namespace='app'] - A namespace for the cache keys, defaulting to 'app'.
	 * @param {Object} [opts.redisOptions={}] - Additional options for Redis connection.
	 */
	constructor(opts = {}) {
		const {
			address,
			namespace = 'app',
			redisOptions = {},
		} = opts

		redisOptions.keyPrefix = redisOptions?.keyPrefix ?? 'tadashi_cache_redis'
		redisOptions.keyPrefix = `${redisOptions.keyPrefix}_${namespace}:`

		this.namespace = '@ns'
		this.redis = connect({ ...redisOptions, address })
	}

	/**
	 * Retrieve a value from the cache.
	 *
	 * @param {string} key - The key of the item to retrieve.
	 * @returns {Promise<*>} The decompressed value retrieved from the cache, or undefined if not found.
	 */
	async get(key) {
		let value = await this.redis.getBuffer(key)
		if (value === undefined || value === null) {
			return
		}

		value = await decompress(value)
		return value
	}

	/**
	 * Set a value in the cache.
	 *
	 * @param {string} key - The key under which the value will be stored.
	 * @param {*} value - The value to store in the cache.
	 * @param {string} [expire] - Expiration mode ('EX', 'PX', 'EXAT', 'PXAT').
	 * @param {number} [ttl=0] - The time-to-live for the cache entry.
	 * @returns {Promise<boolean>} True if the operation succeeded, otherwise false.
	 */
	async set(key, value, expire, ttl = 0) {
		if (value === undefined) {
			return
		}

		let _ttl = typeof ttl === 'number' ? ttl : Number(ttl)
		_ttl = Number.isInteger(_ttl) ? _ttl : 0

		const _value = await compress(value, { base64: false })
		// let args: [string, string, ...unknown[]] = [key, _value]
		let args = [key, _value]

		if (expire === 'EX' || expire === 'PX') {
			args = [...args, expire, _ttl]
		}

		if (expire === 'EXAT' || expire === 'PXAT') {
			const _time = _ttl + Math.floor(Date.now() / (expire === 'EXAT' ? 1000 : 1))
			args = [...args, expire, _time]
		}

		const [[, set], [, sadd]] = await this.redis
			.multi()
			// @ts-ignore: pure js
			.set(...args)
			.sadd(this.namespace, key)
			.exec()

		return Boolean(set && sadd)
	}

	/**
	 * Delete a value from the cache.
	 *
	 * @param {string} key - The key of the item to delete.
	 * @returns {Promise<boolean>} True if the deletion succeeded, otherwise false.
	 */
	async delete(key) {
		const [[, del], [, srem]] = await this.redis
			.multi()
			.del(key)
			.srem(this.namespace, key)
			.exec()
		return Boolean(del && srem)
	}

	/**
	 * Clear the entire cache.
	 *
	 * @returns {Promise<void>} A promise that resolves when the cache is cleared.
	 */
	async clear() {
		const keys = await this.redis.smembers(this.namespace)
		const args = [...keys, this.namespace]
		await this.redis.del(...args)
	}
}

export default Cache

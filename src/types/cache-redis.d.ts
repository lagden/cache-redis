export default Cache
/**
 * Class representing a cache using Redis with compression capabilities.
 */
declare class Cache {
	/**
	 * Create a cache instance.
	 *
	 * @param {Object} [opts={}] - Options for configuring the cache.
	 * @param {string} [opts.address] - The address of the Redis server.
	 * @param {string} [opts.namespace='app'] - A namespace for the cache keys, defaulting to 'app'.
	 * @param {Object} [opts.redisOptions={}] - Additional options for Redis connection.
	 */
	constructor(opts?: {
		address?: string
		namespace?: string
		redisOptions?: any
	})
	namespace: string
	redis: import('ioredis').Cluster | import('ioredis').default
	/**
	 * Retrieve a value from the cache.
	 *
	 * @param {string} key - The key of the item to retrieve.
	 * @returns {Promise<*>} The decompressed value retrieved from the cache, or undefined if not found.
	 */
	get(key: string): Promise<any>
	/**
	 * Set a value in the cache.
	 *
	 * @param {string} key - The key under which the value will be stored.
	 * @param {*} value - The value to store in the cache.
	 * @param {string} [expire] - Expiration mode ('EX', 'PX', 'EXAT', 'PXAT').
	 * @param {number} [ttl=0] - The time-to-live for the cache entry.
	 * @returns {Promise<boolean>} True if the operation succeeded, otherwise false.
	 */
	set(key: string, value: any, expire?: string, ttl?: number): Promise<boolean>
	/**
	 * Delete a value from the cache.
	 *
	 * @param {string} key - The key of the item to delete.
	 * @returns {Promise<boolean>} True if the deletion succeeded, otherwise false.
	 */
	delete(key: string): Promise<boolean>
	/**
	 * Clear the entire cache.
	 *
	 * @returns {Promise<void>} A promise that resolves when the cache is cleared.
	 */
	clear(): Promise<void>
}

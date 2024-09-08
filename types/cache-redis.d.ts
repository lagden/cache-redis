export default Cache;
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
        address?: string;
        namespace?: string;
        redisOptions?: any;
    });
    namespace: string;
    redis: import("ioredis").Cluster | import("ioredis").default;
    /**
     * Retrieve a value from the cache.
     *
     * @param {string} key - The key of the item to retrieve.
     * @returns {Promise<*>} A promise that resolves with the decompressed value retrieved from the cache, or undefined if not found.
     */
    get(key: string): Promise<any>;
    /**
     * Set a value in the cache.
     *
     * @param {string} key - The key under which the value will be stored.
     * @param {*} value - The value to store in the cache.
     * @param {string} [expire] - Optional expiration mode ('EX', 'PX', 'EXAT', 'PXAT').
     * @param {number} [ttl=0] - Optional time-to-live for the cache entry.
     * @returns {Promise<Object>} An object indicating the success of the set and sadd operations.
     */
    set(key: string, value: any, expire?: string, ttl?: number): Promise<any>;
    /**
     * Delete a value from the cache.
     *
     * @param {string} key - The key of the item to delete.
     * @returns {Promise<Object>} An object indicating the success of the del and srem operations.
     */
    delete(key: string): Promise<any>;
    /**
     * Clear the entire cache.
     *
     * @returns {Promise<void>} A promise that resolves when the cache is cleared.
     */
    clear(): Promise<void>;
}

'use strict'

const Redis = require('ioredis')

function _splitCommaDelimitedAddresses(addresses) {
	return addresses.split(',').map(address => {
		const [host, port = 6379] = address.split(':')
		return {host, port}
	})
}

function connectRedis(opts, addresses) {
	const {host, port = 6379} = opts
	const _addresses = host ? `${host}:${port}` : addresses
	const collectionAddresses = _splitCommaDelimitedAddresses(_addresses)
	if (collectionAddresses.length > 1) {
		return new Redis.Cluster(collectionAddresses, opts)
	}
	return new Redis({...opts, ...collectionAddresses[0]})
}

module.exports = connectRedis

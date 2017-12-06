'use strict'

import test from 'ava'
import Cache from '../.'

function sleep(t) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('wakeup')
		}, t)
	})
}

async function _cleanup() {
	const _cache = new Cache()
	await _cache.clear()
}

test.before(_cleanup)
test.after(_cleanup)

test('default', async t => {
	const _cache = new Cache()
	await _cache.set('a', {a: 123})
	const {a} = await _cache.get('a')
	t.is(a, 123)
})

test('undefined', async t => {
	const _cache = new Cache()
	await _cache.set('b', undefined)
	const res = await _cache.get('b')
	t.is(res, undefined)
})

test('ttl', async t => {
	const _cache = new Cache()
	await _cache.set('c', {c: 456}, 1000, 'PX')
	const {c} = await _cache.get('c')
	t.is(c, 456)
	await sleep(1200)
	const res = await _cache.get('c')
	t.is(res, undefined)
})

test('delete', async t => {
	const _cache = new Cache({
		redis: {keyPrefix: 'unitTest'}
	})
	await _cache.set('d', {d: 789})
	const {d} = await _cache.get('d')
	t.is(d, 789)
	const _delete = await _cache.delete('d')
	t.true(_delete)
})

test('clear', async t => {
	const _cache = new Cache({
		redis: {keyPrefix: 'unitTestClear'}
	})
	await _cache.set('e', {e: 1011})
	const {e} = await _cache.get('e')
	t.is(e, 1011)
	const _clear = await _cache.clear()
	t.is(_clear, undefined)
})

test.cb('error', t => {
	const _cache = new Cache({
		redis: {host: 'invalid'}
	})
	_cache.redis.on('error', err => {
		t.is(err.code, 'ENOTFOUND')
		t.end()
	})
})

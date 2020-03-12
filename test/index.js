'use strict'

const test = require('ava')
const Cache = require('..')

function sleep(t) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, t)
	})
}

test.before(async () => {
	const _m = new Cache()
	await _m.clear()

	const _n = new Cache({namespace: 'test'})
	await _n.clear()
})

test('default', async t => {
	const _b = new Cache()
	await _b.set('a', {a: 123})
	const {a} = await _b.get('a')
	t.is(a, 123)
})

test('namespace', async t => {
	const _b = new Cache({namespace: 'test'})
	await _b.set('a', {a: 123})
	const {a} = await _b.get('a')
	t.is(a, 123)
})

test('undefined', async t => {
	const _c = new Cache()
	await _c.set('b', undefined)
	const res = await _c.get('b')
	t.is(res, undefined)
})

test('ttl PX', async t => {
	const _d = new Cache()
	await _d.set('c', {c: 456}, 'PX', 1000)
	const {c} = await _d.get('c')
	t.is(c, 456)
	await sleep(1200)
	const res = await _d.get('c')
	t.is(res, undefined)
})

test('ttl EX', async t => {
	const _d = new Cache()
	await _d.set('c', {c: 456}, 'EX', 1)
	const {c} = await _d.get('c')
	t.is(c, 456)
	await sleep(2000)
	const res = await _d.get('c')
	t.is(res, undefined)
})

test('ttl EX 30', async t => {
	const _d = new Cache()
	await _d.set('cc', {c: 456}, 'EX', 30)
	const {c} = await _d.get('cc')
	t.is(c, 456)
	await sleep(2000)
	const res = await _d.get('cc')
	t.is(JSON.stringify(res), JSON.stringify({c: 456}))
})

test('delete', async t => {
	const _e = new Cache({
		redis: {
			keyPrefix: 'unitTest',
			host: 'localhost'
		}
	})
	await _e.set('d', {d: 789})
	const {d} = await _e.get('d')
	t.is(d, 789)
	const _delete = await _e.delete('d')
	t.true(_delete)
})

test('clear', async t => {
	const _f = new Cache({
		redis: {keyPrefix: 'unitTestClear'}
	})
	await _f.set('e', {e: 1011})
	const {e} = await _f.get('e')
	t.is(e, 1011)
	const _clear = await _f.clear()
	t.is(_clear, undefined)
})

test.cb('error', t => {
	const _g = new Cache({redis: {retryStrategy: () => false}}, 'xxx')
	_g.redis.on('error', error => {
		t.is(error.code, 'ENOTFOUND')
		t.end()
	})
})

test('hash', async t => {
	const ts = Date.now()
	const _z = new Cache()
	await _z.redis.hset('room_id', 'user_id', ts)
	const r = await _z.redis.hget('room_id', 'user_id')
	t.is(Number(r), ts)
})

test.cb('cluster', t => {
	const _x = new Cache({redis: {
		clusterRetryStrategy: () => false
	}}, '127.0.0.1:6379,127.0.0.1:6379')
	_x.redis.on('error', error => {
		t.is(error.message, 'Failed to refresh slots cache.')
		t.end()
	})
})

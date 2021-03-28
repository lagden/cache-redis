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

async function _clear() {
	const _m = new Cache()
	await _m.clear()

	const _n = new Cache({namespace: 'test'})
	await _n.clear()
}

test.before(async () => {
	await _clear()
})

test.after(async () => {
	await _clear()
})

test('default', async t => {
	const _a = new Cache()
	await _a.set('a', {a: 123})
	const {a} = await _a.get('a')
	t.is(a, 123)
})

test('namespace', async t => {
	const _a = new Cache({namespace: 'test'})
	await _a.set('a', {a: 456})
	const {a} = await _a.get('a')
	t.is(a, 456)
})

test('undefined', async t => {
	const _b = new Cache()
	await _b.set('b', undefined)
	const res = await _b.get('b')
	t.is(res, undefined)
})

test('primitive', async t => {
	const _c = new Cache()
	await _c.set('c', 'apenas um show')
	const res = await _c.get('c')
	t.is(res, 'apenas um show')
})

test('ttl PX', async t => {
	const _d = new Cache()
	await _d.set('d', {d: 789}, 'PX', 1000)
	const {d} = await _d.get('d')
	t.is(d, 789)
	await sleep(1200)
	const res = await _d.get('d')
	t.is(res, undefined)
})

test('ttl EX', async t => {
	const _e = new Cache()
	await _e.set('e', {e: 1011}, 'EX', 1)
	const {e} = await _e.get('e')
	t.is(e, 1011)
	await sleep(1200)
	const res = await _e.get('e')
	t.is(res, undefined)
})

test('ttl EX 30', async t => {
	const _f = new Cache()
	await _f.set('f', {f: 1314}, 'EX', 30)
	const {f} = await _f.get('f')
	t.is(f, 1314)
	await sleep(2000)
	const res = await _f.get('f')
	t.is(JSON.stringify(res), JSON.stringify({f: 1314}))
})

test('ttl isNaN', async t => {
	const _g = new Cache()
	await _g.set('nan', 'some data', 'EX', 'XXX')
	const res = await _g.get('nan')
	t.is(res, undefined)
})

test('delete', async t => {
	const _h = new Cache({
		redis: {
			keyPrefix: 'unitTest',
			host: 'localhost'
		}
	})
	await _h.set('h', {h: 1516})
	const {h} = await _h.get('h')
	t.is(h, 1516)
	const _delete = await _h.delete('h')
	t.true(_delete)
})

test('clear', async t => {
	const _i = new Cache({
		redis: {keyPrefix: 'unitTestClear'}
	})
	await _i.set('i', {i: 1718})
	const {i} = await _i.get('i')
	t.is(i, 1718)
	const _clear = await _i.clear()
	t.is(_clear, undefined)
})

test.cb('error', t => {
	const _g = new Cache({redis: {retryStrategy: () => false}}, 'xxx')
	_g.redis.on('error', error => {
		t.regex(error.code, /EAI_AGAIN|ENOTFOUND/)
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

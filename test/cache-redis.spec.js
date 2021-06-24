import test from 'ava'
import pEvent from 'p-event'
import sleep from '@tadashi/sleep'
import Cache from '../src/cache-redis.js'

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
	await _b.set('b')
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
	await _d.set('d', {d: 789}, 'PX', 1500)
	const {d} = await _d.get('d')
	t.is(d, 789)
	await sleep(2)
	const res = await _d.get('d')
	t.is(res, undefined)
})

test('ttl PXAT', async t => {
	const _dd = new Cache()
	await _dd.set('dd', {dd: 789}, 'PXAT', 1500)
	const {dd} = await _dd.get('dd')
	t.is(dd, 789)
	await sleep(2)
	const res = await _dd.get('dd')
	t.is(res, undefined)
})

test('ttl EX', async t => {
	const _e = new Cache()
	await _e.set('e', {e: 1011}, 'EX', 2)
	const {e} = await _e.get('e')
	t.is(e, 1011)
	await sleep(3)
	const res = await _e.get('e')
	t.is(res, undefined)
})

test('ttl EXAT', async t => {
	const _f = new Cache()
	await _f.set('f', {f: 1011}, 'EXAT', 2)
	const {f} = await _f.get('f')
	t.is(f, 1011)
	await sleep(3)
	const res = await _f.get('f')
	t.is(res, undefined)
})

test('ttl isNaN', async t => {
	const _g = new Cache()
	await _g.set('nan', 'some data', 'EX', 'XXX')
	const res = await _g.get('nan')
	t.is(res, undefined)

	await _g.set('nan_at', 'some data', 'EXAT', 'XXX')
	const res_at = await _g.get('nan')
	t.is(res_at, undefined)
})

test('delete', async t => {
	const _h = new Cache({
		redis: {
			keyPrefix: 'unitTest',
			host: 'localhost',
		},
	})
	await _h.set('h', {h: 1516})
	const {h} = await _h.get('h')
	t.is(h, 1516)
	const _delete = await _h.delete('h')
	t.true(_delete)
})

test('clear', async t => {
	const _i = new Cache({
		redis: {keyPrefix: 'unitTestClear'},
	})
	await _i.set('i', {i: 1718})
	const {i} = await _i.get('i')
	t.is(i, 1718)
	const _clear = await _i.clear()
	t.is(_clear, undefined)
})

test('error', async t => {
	const _g = new Cache({
		redis: {
			retryStrategy: () => false,
		},
		addresses: 'xxx',
	})
	const error = await pEvent(_g.redis, 'error')
	t.regex(error.code, /EAI_AGAIN|ENOTFOUND/)
})

test('hash', async t => {
	const ts = Date.now()
	const _z = new Cache()
	await _z.redis.hset('room_id', 'user_id', ts)
	const r = await _z.redis.hget('room_id', 'user_id')
	t.is(Number(r), ts)
})

test('cluster', async t => {
	const _x = new Cache({
		redis: {
			clusterRetryStrategy: () => false,
		},
		addresses: '127.0.0.1:6379,127.0.0.1:6379',
	})
	const error = await pEvent(_x.redis, 'error')
	t.is(error.message, 'Failed to refresh slots cache.')
})

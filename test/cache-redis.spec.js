import { setTimeout } from 'node:timers/promises'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import Cache from '../src/cache-redis.js'

test('default', async () => {
	const _a = new Cache()
	await _a.set('a', { a: 123 })
	const { a } = await _a.get('a')
	assert.equal(a, 123)
	_a.redis.disconnect(false)
})

test('namespace', async () => {
	const _a = new Cache({ namespace: 'test' })
	await _a.set('a', { a: 456 })
	const { a } = await _a.get('a')
	assert.equal(a, 456)
	_a.redis.disconnect(false)
})

test('undefined', async () => {
	const _b = new Cache()
	await _b.set('b')
	const res = await _b.get('b')
	assert.equal(res, undefined)
	_b.redis.disconnect(false)
})

test('primitive', async () => {
	const _c = new Cache()
	await _c.set('c', 'apenas um show')
	const res = await _c.get('c')
	assert.equal(res, 'apenas um show')
	_c.redis.disconnect(false)
})

test('ttl PX', async () => {
	const _d = new Cache()
	await _d.set('d', { d: 789 }, 'PX', 1000)
	const { d } = await _d.get('d')
	assert.equal(d, 789)
	await setTimeout(1500)
	const res = await _d.get('d')
	assert.equal(res, undefined)
	_d.redis.disconnect(false)
})

test('ttl PXAT', async () => {
	const _dd = new Cache()
	await _dd.set('dd', { dd: 789 }, 'PXAT', 1000)
	const { dd } = await _dd.get('dd')
	assert.equal(dd, 789)
	await setTimeout(1500)
	const res = await _dd.get('dd')
	assert.equal(res, undefined)
	_dd.redis.disconnect(false)
})

test('ttl EX', async () => {
	const _e = new Cache()
	await _e.set('e', { e: 1011 }, 'EX', 1)
	const { e } = await _e.get('e')
	assert.equal(e, 1011)
	await setTimeout(2000)
	const res = await _e.get('e')
	assert.equal(res, undefined)
	_e.redis.disconnect(false)
})

test('ttl EXAT', async () => {
	const _f = new Cache()
	await _f.set('f', { f: 1011 }, 'EXAT', 1)
	const { f } = await _f.get('f')
	assert.equal(f, 1011)
	await setTimeout(2000)
	const res = await _f.get('f')
	assert.equal(res, undefined)
	_f.redis.disconnect(false)
})

test('ttl isNaN', async () => {
	const _g = new Cache()
	await _g.set('nan', 'some data', 'EX', 'XXX')
	const res = await _g.get('nan')
	assert.equal(res, undefined)

	await _g.set('nan_at', 'some data', 'EXAT', 'XXX')
	const res_at = await _g.get('nan')
	assert.equal(res_at, undefined)
	_g.redis.disconnect(false)
})

test('delete', async () => {
	const _h = new Cache({
		redis: {
			keyPrefix: 'unitTest',
			host: 'localhost',
		},
	})
	await _h.set('h', { h: 1516 })
	const { h } = await _h.get('h')
	assert.equal(h, 1516)
	const _delete = await _h.delete('h')
	assert.ok(_delete)
	_h.redis.disconnect(false)
})

test('clear', async () => {
	const _i = new Cache({
		redis: { keyPrefix: 'unitTestClear' },
	})
	await _i.set('i', { i: 1718 })
	const { i } = await _i.get('i')
	assert.equal(i, 1718)
	const _clear = await _i.clear()
	assert.equal(_clear, undefined)
	_i.redis.disconnect(false)
})

test('hash', async () => {
	const ts = Date.now()
	const _z = new Cache()
	await _z.redis.hset('room_id', 'user_id', ts)
	const r = await _z.redis.hget('room_id', 'user_id')
	assert.equal(Number(r), ts)
	_z.redis.disconnect(false)
})

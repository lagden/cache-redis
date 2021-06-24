/*eslint unicorn/prefer-module: 0 */

'use strict'

module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	extends: [
		'xo',
		'plugin:unicorn/recommended',
	],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'no-console': 0,
		'no-debugger': 0,
		'no-unused-expressions': [
			'error',
			{
				allowShortCircuit: true,
				allowTernary: true,
				allowTaggedTemplates: true,
			},
		],
		camelcase: 0,
		'capitalized-comments': 0,
		'spaced-comment': 0,
		'padding-line-between-statements': 0,
		'no-undef-init': 0,
		'unicorn/filename-case': 0,
		'unicorn/prevent-abbreviations': 0,
		'unicorn/no-reduce': 0,
		'unicorn/no-array-reduce': 0,
		// 'unicorn/no-abusive-eslint-disable': 0,
		// Bug no ctx.body Koa
		'require-atomic-updates': 0,
	},
}

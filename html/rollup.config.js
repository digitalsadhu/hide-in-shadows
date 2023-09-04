import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
	input: 'polyfill.js',
	output: {
		file: 'dist/polyfill.js',
		format: 'iife',
		sourcemap: false,
	},
	plugins: [
		resolve(),
		commonjs(),
		terser(),
	]
};
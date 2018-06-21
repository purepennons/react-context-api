import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'linguiStringValidation',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      external(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      }),
      resolve(),
      commonjs()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      external(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      }),
      resolve(),
      commonjs()
    ]
  }
];

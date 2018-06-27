import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';

import pkg from './package.json';

const plugins = [
  external(),
  postcss({
    modules: true
  }),
  url(),
  typescript({ cacheRoot: `./temp/.rpt2_cache` }),
  babel({
    exclude: 'node_modules/**'
  }),
  resolve(),
  commonjs()
];

export default [
  {
    input: 'src/index.tsx',
    output: {
      name: 'reactContextAPIUtils',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: plugins
  },
  {
    input: 'src/index.tsx',
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
    plugins: plugins
  }
];

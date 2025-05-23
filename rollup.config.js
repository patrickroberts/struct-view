import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = 'src/index.ts';
const name = 'SV';
const production = process.env.NODE_ENV === 'production';
const browserslist = pkg.browserslist[process.env.NODE_ENV];

const keys = (deps) => (deps == null ? [] : Object.keys(deps).map((dep) => new RegExp(`^${dep}`)));

export default {
  input,
  external: keys(pkg.peerDependencies),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: production,
      exports: 'auto',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: production,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name,
      sourcemap: production,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      transpiler: 'babel',
      browserslist,
    }),
    production && terser({
      output: {
        comments: false,
      },
    }),
  ],
  watch: {
    clearScreen: false,
  },
};

import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import css from "rollup-plugin-import-css";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.tsx',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: false,
      exports: 'auto',
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: false,
      exports: 'auto',
    },
  ],
  preserveModules: true,
  plugins: [
    peerDepsExternal(),
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    babel({
      babelHelpers: "runtime",
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    resolve(),
    commonjs(),
    css({
      minify: true,
      output: 'style.css'
    }),
    terser(),
  ],
  external: ["react", "react-dom"],
};

import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const fullSrcPath = path.resolve('src');

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
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }),
    nodeResolve({ jail: fullSrcPath }),
    commonjs(),
    terser(),
  ],
  external: ['react', 'react-dom'],
};

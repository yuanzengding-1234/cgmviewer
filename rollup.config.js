import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  // ES modules build
  {
    input: 'src/cgm-preview.ts',
    output: {
      file: 'dist/cgm-preview.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src'
      })
    ]
  },
  // UMD build
  {
    input: 'src/cgm-preview.ts',
    output: {
      file: 'dist/cgm-preview.js',
      format: 'umd',
      name: 'CGMPreview',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript()
    ]
  }
];
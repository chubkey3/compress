import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'
import commonjs from '@rollup/plugin-commonjs'

const output = (format, filename) => {
  const base = {
    file: `dist/${format}/${filename}.js`,
    format,
    sourcemap: true,
    name: 'compress'    
  }

  return [
    base,
    { ...base, file: `dist/${format}/${filename}.min.js`, plugins: [terser()]},
  ]
}


export default [
  {
    plugins: [typescript(), nodeResolve(), preserveShebangs()],
    external: ['imagemin', 'imagemin-webp', 'imagemin-pngquant', 'imagemin-jpegtran', 'imagemin-mozjpeg', 'imagemin-optipng', 'imagemin-gifsicle', 'imagemin-svgo'],

    input: 'src/bin.ts',
    output: [...output('esm', 'bin'), ...output('cjs', 'bin')]
  },
  {
    plugins: [typescript(), nodeResolve(), commonjs()],
    external: ['imagemin', 'imagemin-pngquant', 'imagemin-mozjpeg', 'imagemin-gifsicle', 'imagemin-svgo', 'fs'],

    input: 'src/index.ts',
    output: [...output('esm', 'index'), ...output('cjs', 'index')]
  },
]
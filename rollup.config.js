import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

const output = (format) => {
  const base = {
    file: `dist/${format}.js`,
    format,
    sourcemap: true,
    name: 'compress',
    globals: {
      
    }
  }

  return [
    base,
    { ...base, file: `dist/${format}.min.js`, plugins: [terser()]},
  ]
}


export default [
  {
    plugins: [typescript(), nodeResolve(), preserveShebangs()],
    external: ['imagemin', 'imagemin-webp', 'imagemin-pngquant', 'imagemin-jpegtran', 'imagemin-mozjpeg', 'imagemin-optipng'],

    input: 'src/index.ts',
    output: [...output('esm')]
  }
]
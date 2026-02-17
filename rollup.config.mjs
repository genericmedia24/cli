import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'

export default {
  external: [
    'commander',
    'node:fs',
    'node:os',
    'node:path',
  ],
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    del({
      runOnce: true,
      targets: 'dist',
    }),
    nodeResolve(),
    typescript(),
  ],
}

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    "src/cli.ts",
    "src/executor.ts",
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  }
})

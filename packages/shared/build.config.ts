import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: [
    "src/index.ts",
    "src/copy/index.ts",
    "src/shell/index.ts",
  ],
  declaration: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
  }
})

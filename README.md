# Clawde Wiki

A TypeScript project.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

## Scripts

- `npm run dev` - Run the project in development mode with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and recompile
- `npm run start` - Run the compiled JavaScript
- `npm run clean` - Remove the dist folder
- `npm run tree` - Display project directory tree
- `npm run tree:git` - Display Git tracked files tree

## Features

### Directory Tree Generator

项目包含一个强大的目录树生成工具 (`src/tree.ts`)，可以：

1. **生成完整的目录树结构**
   ```bash
   npm run tree
   ```

2. **显示 Git 跟踪的文件**
   ```bash
   npm run tree:git
   ```

3. **编程方式使用**
   ```typescript
   import { DirectoryTree, generateGitTree } from './tree';

   // 生成目录树
   const dirTree = new DirectoryTree();
   dirTree.printTree('/path/to/directory', 5); // 最大深度 5

   // 生成 Git 跟踪文件树
   const gitTree = generateGitTree('/path/to/repo');
   console.log(gitTree);
   ```

功能特性：
- 自动忽略 `node_modules`、`.git`、`dist` 等常见目录
- 支持自定义忽略模式
- 支持深度限制
- 美观的树形显示
- 支持 Git 集成，显示版本控制的文件


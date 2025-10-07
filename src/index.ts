import { DirectoryTree, generateGitTree } from './tree';

// 示例：打印当前项目目录树
console.log('=== 完整目录树 ===\n');
const dirTree = new DirectoryTree();
dirTree.printTree(process.cwd(), 5);

// 示例：打印 Git 跟踪的文件（main 分支）
console.log('\n=== Git 跟踪的文件 (main 分支) ===\n');
try {
  const gitTree = generateGitTree(process.cwd(), 'main');
  console.log(gitTree);
} catch (error) {
  console.log('未找到 Git 仓库或 Git 命令失败');
}

export {};


import * as fs from 'fs';
import * as path from 'path';

interface TreeOptions {
  prefix?: string;
  isLast?: boolean;
  maxDepth?: number;
  currentDepth?: number;
  ignorePatterns?: string[];
}

/**
 * 获取项目目录树结构
 */
export class DirectoryTree {
  private readonly ignorePatterns: string[];

  constructor(ignorePatterns: string[] = []) {
    this.ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.DS_Store',
      ...ignorePatterns,
    ];
  }

  /**
   * 检查文件/目录是否应该被忽略
   */
  private shouldIgnore(name: string): boolean {
    return this.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern || name.includes(pattern);
    });
  }

  /**
   * 生成目录树
   */
  public generateTree(
    dirPath: string,
    options: TreeOptions = {}
  ): string {
    const {
      prefix = '',
      isLast = true,
      maxDepth = Infinity,
      currentDepth = 0,
    } = options;

    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);

    // 根节点特殊处理
    if (currentDepth === 0) {
      let result = name + '/\n';

      if (stats.isDirectory()) {
        const items = fs.readdirSync(dirPath);
        const filteredItems = items.filter(
          (item: string) => !this.shouldIgnore(item)
        );

        filteredItems.forEach((item: string, index: number) => {
          const itemPath = path.join(dirPath, item);
          const isLastItem = index === filteredItems.length - 1;

          result += this.generateTree(itemPath, {
            prefix: '',
            isLast: isLastItem,
            maxDepth,
            currentDepth: currentDepth + 1,
          });
        });
      }

      return result;
    }

    // 检查深度限制
    if (currentDepth > maxDepth) {
      return '';
    }

    // 构建当前行
    const connector = isLast ? '└── ' : '├── ';
    let result = prefix + connector + name;

    if (stats.isDirectory()) {
      result += '/\n';

      // 读取目录内容
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      
      try {
        const items = fs.readdirSync(dirPath);
        const filteredItems = items.filter(
          (item: string) => !this.shouldIgnore(item)
        );

        filteredItems.forEach((item: string, index: number) => {
          const itemPath = path.join(dirPath, item);
          const isLastItem = index === filteredItems.length - 1;

          result += this.generateTree(itemPath, {
            prefix: newPrefix,
            isLast: isLastItem,
            maxDepth,
            currentDepth: currentDepth + 1,
          });
        });
      } catch (error) {
        result += newPrefix + '(permission denied)\n';
      }
    } else {
      result += '\n';
    }

    return result;
  }

  /**
   * 打印目录树到控制台
   */
  public printTree(dirPath: string, maxDepth?: number): void {
    const tree = this.generateTree(dirPath, { maxDepth });
    console.log(tree);
  }
}

/**
 * 获取 Git 跟踪的文件列表
 */
export function getGitTrackedFiles(repoPath: string): string[] {
  const { execSync } = require('child_process');

  try {
    const output = execSync('git ls-files', {
      cwd: repoPath,
      encoding: 'utf-8',
    }) as string;

    return output
      .trim()
      .split('\n')
      .filter((line: string) => line.length > 0);
  } catch (error) {
    throw new Error('Not a git repository or git command failed');
  }
}

/**
 * 生成 Git 跟踪文件的树结构
 */
export function generateGitTree(repoPath: string): string {
  const files = getGitTrackedFiles(repoPath);
  const tree: any = {};

  // 构建树结构
  files.forEach((file: string) => {
    const parts = file.split('/');
    let current = tree;

    parts.forEach((part: string, index: number) => {
      if (index === parts.length - 1) {
        // 文件
        current[part] = null;
      } else {
        // 目录
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  // 渲染树
  function renderTree(
    node: any,
    prefix: string = '',
    isLast: boolean = true
  ): string {
    let result = '';
    const entries = Object.entries(node);

    entries.forEach(([key, value], index) => {
      const isLastItem = index === entries.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const isDirectory = value !== null;

      result += prefix + connector + key;

      if (isDirectory) {
        result += '/\n';
        const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
        result += renderTree(value, newPrefix, isLastItem);
      } else {
        result += '\n';
      }
    });

    return result;
  }

  return path.basename(repoPath) + '/\n' + renderTree(tree);
}

// CLI 使用示例
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetPath = args[0] || process.cwd();
  const useGit = args.includes('--git');
  const maxDepth = args.includes('--depth')
    ? parseInt(args[args.indexOf('--depth') + 1])
    : undefined;

  console.log('Project Directory Tree:\n');

  if (useGit) {
    try {
      const tree = generateGitTree(targetPath);
      console.log(tree);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  } else {
    const dirTree = new DirectoryTree();
    dirTree.printTree(targetPath, maxDepth);
  }
}


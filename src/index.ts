/**
 * Clawde Wiki - Claude Agent SDK 项目
 * 
 * 这是一个集成了 Anthropic Claude SDK 的 TypeScript 项目
 */

import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

console.log('=== Clawde Wiki ===\n');
console.log('一个基于 Claude Agent SDK 的 TypeScript 项目\n');

console.log('可用的示例命令：');
console.log('- npm run example:simple    # 简单对话示例');
console.log('- npm run example:tools     # 工具调用示例');
console.log('- npm run example:session   # 会话管理示例');
console.log('- npm run tree              # 显示目录树');
console.log('- npm run tree:git          # 显示 Git 文件树');
console.log('\n提示: 请先在 .env 文件中设置 ANTHROPIC_API_KEY\n');

// 导出模块
export * from './agent';
export * from './tree';


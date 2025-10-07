# Clawde Wiki

一个集成了 [Anthropic Claude SDK](https://github.com/anthropics/anthropic-sdk-typescript) 的 TypeScript 项目，参考了 [claude-code-sdk-demos](https://deepwiki.com/anthropics/claude-code-sdk-demos/3.3-ai-chat-interface) 项目架构。

## 功能特性

- 🤖 **Claude Agent SDK 集成** - 完整的 Claude AI 对话功能
- 🛠️ **工具调用系统** - 支持自定义工具扩展
- 💬 **会话管理** - 多会话支持和历史记录
- 📁 **目录树工具** - 使用 `git ls-tree` API 的目录可视化
- 📝 **TypeScript** - 完整的类型支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

创建 `.env` 文件并添加你的 Anthropic API Key：

```bash
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
```

### 3. 运行示例

```bash
# 简单对话示例
npm run example:simple

# 工具调用示例
npm run example:tools

# 会话管理示例
npm run example:session
```

## 开发

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 运行构建后的代码
npm start

# 监听模式（自动重新编译）
npm run watch
```

## 命令列表

### Claude Agent 示例
- `npm run example:simple` - 简单对话示例
- `npm run example:tools` - 带工具调用的对话示例
- `npm run example:session` - 会话管理示例

### 开发命令
- `npm run dev` - 开发模式运行
- `npm run build` - 编译 TypeScript
- `npm run watch` - 监听模式
- `npm run start` - 运行编译后的代码
- `npm run clean` - 清理 dist 目录

### 工具命令
- `npm run tree` - 显示项目目录树
- `npm run tree:git` - 显示 Git 跟踪的文件树

## 功能详解

### 1. Claude Agent SDK 集成

项目完整集成了 Anthropic Claude SDK，提供了易用的 Agent 接口。

#### 基本使用

```typescript
import { ClaudeAgent } from './agent';

const agent = new ClaudeAgent({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  systemPrompt: '你是一个友好的助手',
});

// 简单对话
const response = await agent.chat('你好！');
console.log(response);

// 带工具的对话
const toolResponse = await agent.chatWithTools('现在几点了？');
```

#### 支持的工具

- `get_current_time` - 获取当前时间
- `web_search` - 网页搜索（示例实现）
- `read_file` - 读取文件内容

你可以在 `src/agent/tools.ts` 中添加自定义工具。

#### 会话管理

```typescript
import { SessionManager } from './agent';

const sessionManager = new SessionManager();
const session = sessionManager.createSession();

// 添加消息到会话
sessionManager.addMessage(session.id, {
  role: 'user',
  content: '你好',
});

// 获取会话历史
const history = sessionManager.getMessages(session.id);
```

### 2. 目录树工具

项目包含一个强大的目录树生成工具 (`src/tree.ts`)，可以：

1. **生成完整的目录树结构**
   ```bash
   npm run tree
   ```

2. **显示 Git 跟踪的文件（使用 `git ls-tree`）**
   ```bash
   npm run tree:git
   ```

3. **编程方式使用**
   ```typescript
   import { DirectoryTree, generateGitTree } from './tree';

   // 生成目录树
   const dirTree = new DirectoryTree();
   dirTree.printTree('/path/to/directory', 5); // 最大深度 5

   // 生成 Git 跟踪文件树（默认 main 分支）
   const gitTree = generateGitTree('/path/to/repo', 'main');
   console.log(gitTree);
   
   // 指定其他分支
   const devTree = generateGitTree('/path/to/repo', 'develop');
   console.log(devTree);
   ```

工具特性：
- 自动忽略 `node_modules`、`.git`、`dist` 等常见目录
- 支持自定义忽略模式
- 支持深度限制
- 美观的树形显示
- 使用 `git ls-tree` API 获取版本控制的文件（支持指定分支）
- 支持多分支查看

## 项目结构

```
clawde-wiki/
├── src/
│   ├── agent/              # Claude Agent SDK 相关
│   │   ├── claudeAgent.ts  # Agent 主类
│   │   ├── types.ts        # 类型定义
│   │   ├── tools.ts        # 工具定义和执行器
│   │   ├── session.ts      # 会话管理
│   │   └── index.ts        # 模块导出
│   ├── examples/           # 示例代码
│   │   ├── simpleChat.ts   # 简单对话示例
│   │   ├── chatWithTools.ts # 工具调用示例
│   │   └── sessionManagement.ts # 会话管理示例
│   ├── tree.ts             # 目录树工具
│   └── index.ts            # 项目入口
├── package.json
├── tsconfig.json
├── .env                    # 环境变量（需自己创建）
└── README.md
```

## 参考项目

本项目参考了 Anthropic 官方的 [claude-code-sdk-demos](https://deepwiki.com/anthropics/claude-code-sdk-demos/3.3-ai-chat-interface) 项目，特别是 AI Chat Interface 的架构设计。

## License

ISC


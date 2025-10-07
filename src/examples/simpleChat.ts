/**
 * 简单的聊天示例
 */

import * as dotenv from 'dotenv';
import { ClaudeAgent } from '../agent';

// 加载环境变量
dotenv.config();

async function main() {
  // 检查 API Key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('错误: 请设置 ANTHROPIC_API_KEY 环境变量');
    console.log('你可以创建一个 .env 文件并添加:');
    console.log('ANTHROPIC_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // 创建 Agent
  const agent = new ClaudeAgent({
    apiKey,
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: parseInt(process.env.MAX_TOKENS || '4096'),
    systemPrompt: '你是一个友好的 AI 助手，擅长用中文回答问题。',
  });

  console.log('=== Claude Agent 简单对话示例 ===\n');

  try {
    // 简单对话（无工具）
    console.log('用户: 你好，请介绍一下你自己。\n');
    const response1 = await agent.chat('你好，请介绍一下你自己。');
    console.log('助手:', response1);
    console.log('\n---\n');

    // 多轮对话
    const conversationHistory = [
      { role: 'user' as const, content: '我在学习 TypeScript' },
      { role: 'assistant' as const, content: 'TypeScript 是一个很好的选择！它为 JavaScript 添加了类型系统。' },
    ];

    console.log('用户: 能给我一些学习建议吗？\n');
    const response2 = await agent.chat('能给我一些学习建议吗？', conversationHistory);
    console.log('助手:', response2);
    console.log('\n---\n');

  } catch (error) {
    console.error('错误:', (error as Error).message);
  }
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

export { main };


/**
 * 会话管理示例
 */

import * as dotenv from 'dotenv';
import { ClaudeAgent, SessionManager } from '../agent';

// 加载环境变量
dotenv.config();

async function main() {
  // 检查 API Key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('错误: 请设置 ANTHROPIC_API_KEY 环境变量');
    process.exit(1);
  }

  // 创建 Agent 和 SessionManager
  const agent = new ClaudeAgent({
    apiKey,
    systemPrompt: '你是一个友好的助手，记住之前的对话内容。',
  });

  const sessionManager = new SessionManager();

  console.log('=== Claude Agent 会话管理示例 ===\n');

  try {
    // 创建新会话
    const session = sessionManager.createSession();
    console.log(`创建新会话: ${session.id}\n`);

    // 第一轮对话
    console.log('用户: 我叫小明，今年25岁。\n');
    sessionManager.addMessage(session.id, {
      role: 'user',
      content: '我叫小明，今年25岁。',
    });

    const response1 = await agent.chat(
      '我叫小明，今年25岁。',
      sessionManager.getMessages(session.id).slice(0, -1)
    );
    
    console.log('助手:', response1);
    sessionManager.addMessage(session.id, {
      role: 'assistant',
      content: response1,
    });
    console.log('\n---\n');

    // 第二轮对话
    console.log('用户: 你还记得我叫什么名字吗？\n');
    sessionManager.addMessage(session.id, {
      role: 'user',
      content: '你还记得我叫什么名字吗？',
    });

    const response2 = await agent.chat(
      '你还记得我叫什么名字吗？',
      sessionManager.getMessages(session.id).slice(0, -1)
    );
    
    console.log('助手:', response2);
    sessionManager.addMessage(session.id, {
      role: 'assistant',
      content: response2,
    });
    console.log('\n---\n');

    // 第三轮对话
    console.log('用户: 我今年多大了？\n');
    sessionManager.addMessage(session.id, {
      role: 'user',
      content: '我今年多大了？',
    });

    const response3 = await agent.chat(
      '我今年多大了？',
      sessionManager.getMessages(session.id).slice(0, -1)
    );
    
    console.log('助手:', response3);
    sessionManager.addMessage(session.id, {
      role: 'assistant',
      content: response3,
    });
    console.log('\n---\n');

    // 显示会话信息
    console.log('会话信息:');
    console.log(`- 会话 ID: ${session.id}`);
    console.log(`- 消息数量: ${sessionManager.getMessages(session.id).length}`);
    console.log(`- 创建时间: ${session.createdAt.toLocaleString('zh-CN')}`);
    console.log(`- 更新时间: ${session.updatedAt.toLocaleString('zh-CN')}`);

  } catch (error) {
    console.error('错误:', (error as Error).message);
  }
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

export { main };


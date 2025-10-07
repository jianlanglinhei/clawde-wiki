/**
 * 带工具调用的聊天示例
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
    process.exit(1);
  }

  // 创建 Agent
  const agent = new ClaudeAgent({
    apiKey,
    systemPrompt: '你是一个有用的助手，可以使用工具来帮助用户。',
  });

  console.log('=== Claude Agent 工具调用示例 ===\n');

  try {
    // 示例 1: 获取当前时间
    console.log('用户: 现在几点了？\n');
    const response1 = await agent.chatWithTools('现在几点了？');
    
    console.log('助手响应:');
    response1.content.forEach((block) => {
      if (block.type === 'text') {
        console.log('文本:', block.text);
      } else if (block.type === 'tool_use') {
        console.log('工具调用:', {
          name: block.name,
          input: block.input,
        });
      }
    });
    console.log('\n---\n');

    // 示例 2: 读取文件
    console.log('用户: 请帮我读取 package.json 文件的内容\n');
    const response2 = await agent.chatWithTools(
      '请帮我读取 package.json 文件的内容，并告诉我项目名称是什么'
    );
    
    console.log('助手响应:');
    response2.content.forEach((block) => {
      if (block.type === 'text') {
        console.log('文本:', block.text);
      } else if (block.type === 'tool_use') {
        console.log('工具调用:', {
          name: block.name,
          input: block.input,
        });
      }
    });
    console.log('\n---\n');

    // 显示 token 使用情况
    if (response2.usage) {
      console.log('Token 使用:');
      console.log(`- 输入: ${response2.usage.inputTokens}`);
      console.log(`- 输出: ${response2.usage.outputTokens}`);
      console.log(`- 总计: ${response2.usage.inputTokens + response2.usage.outputTokens}`);
    }

  } catch (error) {
    console.error('错误:', (error as Error).message);
    if (error instanceof Error && 'stack' in error) {
      console.error(error.stack);
    }
  }
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

export { main };


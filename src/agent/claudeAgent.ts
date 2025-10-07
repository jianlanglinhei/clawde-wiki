import Anthropic from '@anthropic-ai/sdk';
import {
  AgentConfig,
  Message,
  ContentBlock,
  AgentResponse,
} from './types';
import { availableTools } from './tools';
import { ToolExecutor } from './tools';

/**
 * Claude Agent 类
 * 封装与 Anthropic Claude API 的交互
 */
export class ClaudeAgent {
  private client: Anthropic;
  private config: AgentConfig;
  private toolExecutor: ToolExecutor;

  constructor(config: AgentConfig) {
    this.config = {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4096,
      systemPrompt: 'You are a helpful AI assistant.',
      ...config,
    };

    this.client = new Anthropic({
      apiKey: this.config.apiKey,
    });

    this.toolExecutor = new ToolExecutor();
  }

  /**
   * 发送消息给 Claude
   */
  async sendMessage(
    messages: Message[],
    options?: {
      useTools?: boolean;
      maxIterations?: number;
    }
  ): Promise<AgentResponse> {
    const useTools = options?.useTools ?? true;
    const maxIterations = options?.maxIterations ?? 5;

    let currentMessages = [...messages];
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;

      const response = await this.client.messages.create({
        model: this.config.model!,
        max_tokens: this.config.maxTokens!,
        system: this.config.systemPrompt,
        messages: currentMessages as any,
        tools: useTools ? availableTools as any : undefined,
      });

      // 检查是否有工具调用
      const toolUses = response.content.filter(
        (block: any) => block.type === 'tool_use'
      );

      if (toolUses.length === 0 || !useTools) {
        // 没有工具调用，返回结果
        return {
          role: 'assistant',
          content: response.content as ContentBlock[],
          stopReason: response.stop_reason,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        };
      }

      // 执行工具调用
      const toolResults: ContentBlock[] = [];

      for (const toolUse of toolUses) {
        const toolUseBlock = toolUse as any;
        try {
          const result = await this.toolExecutor.executeTool(
            toolUseBlock.name,
            toolUseBlock.input
          );

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: result,
          });
        } catch (error) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: `Error: ${(error as Error).message}`,
          });
        }
      }

      // 将助手响应和工具结果添加到消息历史
      currentMessages.push({
        role: 'assistant',
        content: response.content as ContentBlock[],
      });

      currentMessages.push({
        role: 'user',
        content: toolResults,
      });
    }

    throw new Error(
      `Maximum iterations (${maxIterations}) reached without final response`
    );
  }

  /**
   * 简单的文本对话（无工具）
   */
  async chat(userMessage: string, conversationHistory?: Message[]): Promise<string> {
    const messages: Message[] = [
      ...(conversationHistory || []),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await this.sendMessage(messages, { useTools: false });

    const textBlocks = response.content.filter((block) => block.type === 'text');
    return textBlocks.map((block) => block.text).join('\n');
  }

  /**
   * 带工具的对话
   */
  async chatWithTools(
    userMessage: string,
    conversationHistory?: Message[]
  ): Promise<AgentResponse> {
    const messages: Message[] = [
      ...(conversationHistory || []),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    return this.sendMessage(messages, { useTools: true });
  }
}


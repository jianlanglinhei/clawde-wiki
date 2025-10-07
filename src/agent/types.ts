/**
 * Agent 相关类型定义
 */

export interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: any;
  content?: string;
  tool_use_id?: string;
}

export interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AgentConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentResponse {
  role: 'assistant';
  content: ContentBlock[];
  stopReason: string | null;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}


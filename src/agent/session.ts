import { ChatSession, Message } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 会话管理器
 * 管理多个聊天会话
 */
export class SessionManager {
  private sessions: Map<string, ChatSession>;

  constructor() {
    this.sessions = new Map();
  }

  /**
   * 创建新会话
   */
  createSession(): ChatSession {
    const session: ChatSession = {
      id: uuidv4(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * 获取会话
   */
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * 添加消息到会话
   */
  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.messages.push(message);
    session.updatedAt = new Date();
  }

  /**
   * 获取会话消息历史
   */
  getMessages(sessionId: string): Message[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return session.messages;
  }

  /**
   * 删除会话
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * 清除所有会话
   */
  clearAllSessions(): void {
    this.sessions.clear();
  }

  /**
   * 获取所有会话 ID
   */
  getAllSessionIds(): string[] {
    return Array.from(this.sessions.keys());
  }
}


import { useEffect, useMemo, useRef, useState } from 'react';
import { ReloadOutlined, SendOutlined } from '@ant-design/icons';
import '../css/chatbot.css';
import { getChatbotEndpoint, sendChatMessage } from '../services/chatbot';

const WELCOME_MESSAGE = {
  id: 'assistant-welcome',
  role: 'assistant',
  content: '你好！我是书店智能助理，可以查询库存、推荐图书，或通过 MCP 工具访问“书店里有什么”服务。试着问我一个问题吧。',
  timestamp: Date.now(),
};

const SUGGEST_PROMPTS = [
  '书店里有什么？',
  '给我推荐一本推理小说',
  '最近有哪些新书上架？',
  '帮我查询一下我的订单状态',
];

const MAX_HISTORY = 12;

// 将任意响应结构转换为可显示的字符串，方便调试不同 Agent 输出。
const formatAssistantReply = (payload) => {
  if (payload == null) {
    return '';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    const combined = payload
      .map((item) => formatAssistantReply(item))
      .filter(Boolean)
      .join('\n\n');
    return combined || JSON.stringify(payload, null, 2);
  }

  if (typeof payload === 'object') {
    const knownFields =
      payload.answer ||
      payload.result ||
      payload?.data?.answer ||
      payload.message ||
      payload.output ||
      payload.text;
    if (knownFields) {
      return knownFields;
    }
    try {
      return JSON.stringify(payload, null, 2);
    } catch (error) {
      return String(payload);
    }
  }

  return String(payload);
};

export function ChatBotPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listRef = useRef(null);
  const messagesRef = useRef(messages);
  const endpoint = useMemo(() => getChatbotEndpoint(), []);

  const syncMessages = (nextList) => {
    messagesRef.current = nextList;
    setMessages(nextList);
  };

  const appendMessage = (message) => {
    const trimmedHistory = messagesRef.current.slice(-MAX_HISTORY + 1);
    const nextMessages = [...trimmedHistory, message];
    syncMessages(nextMessages);
    return nextMessages;
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const buildHistoryPayload = (history) =>
    history.map(({ role, content }) => ({ role, content }));

  const handleSend = async (text) => {
    const question = (text ?? inputValue).trim();
    if (!question || isSending) {
      return;
    }

    setErrorMessage('');
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    const historyForAgent = buildHistoryPayload([
      ...messagesRef.current,
      userMessage,
    ]);

    appendMessage(userMessage);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        question,
        history: historyForAgent,
      });
      const assistantReply =
        formatAssistantReply(response) || '机器人已经处理完毕，但没有返回任何文本。';

      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: Date.now(),
      });
    } catch (error) {
      setErrorMessage(error.message);
      appendMessage({
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: `抱歉，暂时无法连接到聊天机器人：${error.message}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    syncMessages([WELCOME_MESSAGE]);
    setErrorMessage('');
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-stage">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <h1>书店智能伙伴</h1>
            <span>利用大模型与 MCP 工具，实时回答与图书相关的问题。</span>
          </div>
          <div className="chatbot-endpoint">当前代理：{endpoint}</div>
        </div>

        <div className="chatbot-tags">
          {SUGGEST_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chatbot-tag"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
            >
              {prompt}
            </button>
          ))}
          <button
            type="button"
            className="chatbot-tag"
            onClick={handleReset}
            disabled={isSending}
          >
            <ReloadOutlined /> 重置会话
          </button>
        </div>

        <div className="chatbot-body">
          <div className="chatbot-messages" ref={listRef}>
            {messages.map((message) => (
              <div key={message.id} className={`message-bubble ${message.role}`}>
                {message.content}
                <div className="message-meta">
                  {message.role === 'assistant' ? 'IntelliBot' : '你'} ·{' '}
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="chatbot-input-card">
            {errorMessage && <div className="chatbot-alert">{errorMessage}</div>}
            <div className="chatbot-input-row">
              <textarea
                placeholder="请描述你的问题，例如：帮我找找有哪些人工智能入门书籍。"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button type="button" disabled={!inputValue.trim() || isSending} onClick={() => handleSend()}>
                {isSending ? '发送中...' : '发送'}
                <SendOutlined />
              </button>
            </div>
            <div className="chatbot-input-meta">
              <span>消息将发送至 n8n Agent（请确保允许跨域）。</span>
              <span>Shift + Enter 换行</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;

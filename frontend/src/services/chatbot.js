const DEFAULT_CHATBOT_ENDPOINT = 'http://localhost:5678/webhook/chat';

const CHATBOT_ENDPOINT = import.meta.env?.VITE_CHATBOT_ENDPOINT || DEFAULT_CHATBOT_ENDPOINT;

/**
 * Returns the currently configured agent endpoint so the UI can display it.
 */
export function getChatbotEndpoint() {
  return CHATBOT_ENDPOINT;
}

/**
 * Sends a chat payload to the agent service.
 * @param {{ question: string; history?: Array<{ role: string; content: string }> }} payload
 */
export async function sendChatMessage(payload) {
  if (!CHATBOT_ENDPOINT) {
    throw new Error('未配置聊天机器人服务地址 (VITE_CHATBOT_ENDPOINT)。');
  }

  const response = await fetch(CHATBOT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // fall through with null payload, the caller will surface an error card
  }

  if (!response.ok) {
    const message = data?.message || data?.error || '聊天服务返回了错误状态。';
    throw new Error(message);
  }

  return data ?? {};
}

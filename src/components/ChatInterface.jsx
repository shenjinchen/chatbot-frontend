import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Message from './Message';
import axios from 'axios';
import config from '../config';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { logout, sessionId, user } = useAuth();
  const navigate = useNavigate();

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage = {
      text: '你好！我是你的AI助手。有什么我可以帮助你的吗？',
      isUser: false
    };
    setMessages([welcomeMessage]);
  }, []);

  // 每次消息更新后滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 发送消息
  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      text: inputText.trim(),
      isUser: true
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);
    console.info('sendMessage', inputText.trim());
    try {
      debugger
      // 模拟API调用
      const botMessage = {
        text: await generateAiResponse(inputText.trim()),
        isUser: false
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: '抱歉，我现在无法回答你的问题。请稍后再试。',
        isUser: false
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 生成模拟回复
  const generateAiResponse = async (userMessage) => {
    console.info('generateAiResponse', userMessage);
    const lowercaseMessage = userMessage.toLowerCase();
    try {
      let request = {
        "message": lowercaseMessage.trim(),
        "session_id": sessionId
      }
      const res = await axios.post(config.API_BASE_URL+config.CHAT_API, request, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      
      // 安全地处理API响应
      if (!res || !res.data) {
        throw new Error('Invalid API response');
      }
      
      // 根据实际API响应结构返回合适的字段
      return res.data.response || res.data.text || '抱歉，无法解析响应内容。';
    } catch (err) {
      console.error('Error sending message:', err);
      return '抱歉，我现在无法回答你的问题。请稍后再试。';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>AI聊天助手</h2>
        <button onClick={handleLogout} className="logout-button">登出</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
        {isTyping && (
          <div className="message bot-message typing">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的消息...按Enter发送，Shift+Enter换行"
          rows={1}
        />
        <button onClick={sendMessage} disabled={isTyping}>
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
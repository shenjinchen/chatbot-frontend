import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';

// 创建Context
const AuthContext = createContext(null);

// 自定义Hook用于使用AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // 检查本地存储中的登录状态
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
    
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      // 生成并存储session ID
      const uuid = uuidv4();
      setSessionId(uuid);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // 尝试连接真实API
      const response = await fetch(`${config.API_BASE_URL}${config.LOGIN_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('登录失败');
      }
      
      // 先读取响应数据，避免在debugger时流被多次读取
      const data = await response.json();
      debugger;
      // 可以在控制台查看data变量而不是直接读取response.json()
      // 假设API返回的数据包含token和user信息
      const userData = { username: data.username || username, access_token: data.access_token };
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('登录错误:', error);
      // 真实API请求失败时，使用模拟登录（仅用于开发测试）
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('使用模拟登录模式...');
      //   // 模拟成功的响应
      //   const mockUserData = {
      //     username,
      //     token: `mock-token-${Date.now()}`
      //   };
      //   localStorage.setItem('user', JSON.stringify(mockUserData));
      //   setIsLoggedIn(true);
      //   setUser(mockUserData);
      //   return true;
      // }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, sessionId }}>
      {children}
    </AuthContext.Provider>
  );
};
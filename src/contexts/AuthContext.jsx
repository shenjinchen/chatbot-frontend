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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中的登录状态
    const savedUser = localStorage.getItem('user');
    console.log('AuthContext: Checking localStorage for user data:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthContext: Parsed user data:', userData);
        // 确保用户数据包含必要的信息
        if (userData && (userData.access_token || userData.token)) {
          console.log('AuthContext: Valid user data found, setting isLoggedIn to true');
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          console.log('AuthContext: User data missing required fields');
        }
      } catch (error) {
        console.error('AuthContext: Error parsing user data:', error);
        localStorage.removeItem('user'); // 清除无效的用户数据
      }
    }
    
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      // 生成并存储session ID
      sessionId = uuidv4();
      localStorage.setItem('session_id', sessionId);
      console.log('AuthContext: Generated new session ID:', sessionId);
    } else {
      console.log('AuthContext: Found existing session ID');
    }
    setSessionId(sessionId);
    
    // 确保在所有检查完成后才设置isLoading为false
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
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
        return false;
      }
      
      // 先读取响应数据，避免流被多次读取
      const data = await response.json();
      // 可以在控制台查看data变量
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, sessionId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
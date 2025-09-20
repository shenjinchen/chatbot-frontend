import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 简单验证
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    // 调用登录函数
    const success = await login(username, password);
    if (success) {
      navigate('/'); // 登录成功后重定向到聊天界面
    } else {
      setError('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">登录</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
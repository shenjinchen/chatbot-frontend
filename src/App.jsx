import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';

// 受保护路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  // 在AuthContext加载完成前不进行路由跳转
  if (isLoading) {
    // 可以返回一个加载指示器
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        加载中...
      </div>
    );
  }
  
  if (!isLoggedIn) {
    console.log('ProtectedRoute: User not logged in, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: User logged in, allowing access to protected content');
  return children;
};

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;

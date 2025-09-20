import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';

// 受保护路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
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

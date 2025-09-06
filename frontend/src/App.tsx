import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Protected from './protected';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import './App.css';

export default function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

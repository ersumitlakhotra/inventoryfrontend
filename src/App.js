import logo from './logo.svg';
import './App.css';
import {
 BrowserRouter as Router,
 Routes,
 Route,
 BrowserRouter
} from "react-router-dom";
import { AuthProvider } from './auth/authContext';
import ProtectedRoute from './auth/protectedRoute.js';
import ProtectedLayout from './auth/protectedLayout.js';
import Login from './pages/login/login.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login logo={logo} />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
             
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

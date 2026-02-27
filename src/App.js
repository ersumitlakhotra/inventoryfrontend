import logo from './logo.png';
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
import HomePage from './pages/HomePage/homepage.js';
import Inventory from './pages/Inventory/inventory.js'
import Repair from './pages/Repair/repair.js'
import Users from './pages/Users/users.js'
import Settings from './pages/Settings/settings.js'
import Equipment from './pages/Equipment/equipment.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login logo={logo} />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
             <Route path="/home" element={<HomePage/>} />
             <Route path="/inventory" element={<Inventory/>} />
             <Route path="/repair" element={<Repair/>} />
             <Route path="/users" element={<Users/>} />
             <Route path="/equipment" element={<Equipment/>} />
             <Route path="/settings" element={<Settings/>} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

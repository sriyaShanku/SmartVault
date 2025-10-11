import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyles';
import { AuthProvider, useAuth } from './contexts/AuthContext';


// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar'; // Assuming you'll create this later
import BadgesDisplay from './components/BadgesDisplay'; // Assuming you'll create this later


// Private Route Component
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a nice spinner
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <GlobalStyle />
            <Router>
                {/* Render Navbar only if user is logged in */}
                <Routes>
                    <Route path="/*" element={<NavbarWrapper />} />
                </Routes>
                <Routes>
                    <Route path="/login" element={<Auth isRegister={false} />} />
                    <Route path="/register" element={<Auth isRegister={true} />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                     <Route
                        path="/badges"
                        element={
                            <PrivateRoute>
                                <BadgesDisplay />
                            </PrivateRoute>
                        }
                    />
                    {/* You'll add more routes here for specific goals, etc. */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Helper to conditionally render Navbar
function NavbarWrapper() {
    const { user } = useAuth();
    const navigate = useNavigate();
    return user ? <Navbar /> : null;
}


export default App;

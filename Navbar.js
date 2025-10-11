import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
const Nav = styled(motion.nav)`
    background: #1a1e24;
    padding: 15px 40px;
    border-bottom: 1px solid rgba(0, 229, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
`;

const Logo = styled(Link)`
    color: #00e5ff;
    font-family: 'Orbitron', sans-serif;
    font-size: 1.8rem;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 1px;
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
`;

const NavLink = styled(Link)`
    color: #e6edf3;
    text-decoration: none;
    margin-left: 30px;
    font-size: 1rem;
    font-weight: 400;
    transition: color 0.3s ease;
    &:hover {
        color: #00e5ff;
    }
`;

const LogoutButton = styled.button`
    background: #dc3545;
    color: white;
    padding: 8px 15px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    margin-left: 30px;
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0 0 15px rgba(220, 53, 69, 0.6);
        transform: translateY(-2px);
    }
`;

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
            <Logo to="/">SaverSphere</Logo>
            <NavLinks>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/badges">Badges</NavLink>
                {user && <span style={{ color: '#00bcd4', marginLeft: '30px' }}>Hi, {user.username}!</span>}
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </NavLinks>
        </Nav>
    );
};

export default Navbar;

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path

const AuthContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0d1117;
`;

const AuthBox = styled(motion.div)`
    background: #1a1e24;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
    text-align: center;
    border: 1px solid #00bcd4;
    width: 350px;
`;

const Title = styled.h2`
    color: #00e5ff;
    margin-bottom: 25px;
    font-family: 'Orbitron', sans-serif;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
    text-align: left;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #e6edf3;
    font-weight: 300;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #00bcd4;
    background-color: #0d1117;
    color: #e6edf3;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
        outline: none;
        border-color: #00e5ff;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }
`;

const Button = styled(motion.button)`
    width: 100%;
    padding: 12px;
    font-size: 1.1rem;
    margin-top: 15px;
`;

const ToggleLink = styled(Link)`
    display: block;
    margin-top: 20px;
    color: #00e5ff;
    text-decoration: none;
    font-weight: 400;
    &:hover {
        text-decoration: underline;
    }
`;

const Auth = ({ isRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;
        if (isRegister) {
            success = await register(username, password);
            if (success) {
                alert('Registration successful! Please log in.');
                navigate('/login');
            }
        } else {
            success = await login(username, password);
            if (success) {
                navigate('/');
            } else {
                alert('Login failed. Check your credentials.');
            }
        }
    };

    return (
        <AuthContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AuthBox
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
                <Title>{isRegister ? 'Register' : 'Login'}</Title>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <Button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </Button>
                </form>
                <ToggleLink to={isRegister ? '/login' : '/register'}>
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </ToggleLink>
            </AuthBox>
        </AuthContainer>
    );
};

export default Auth;

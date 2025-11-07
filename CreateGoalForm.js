import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import API from '../api/api'; // Assuming your API client is correctly configured

const FormContainer = styled(motion.div)`
    background: #1a1e24;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
    margin: 30px auto;
    max-width: 600px;
    border: 1px solid #00bcd4;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h3`
    color: #00e5ff;
    font-family: 'Orbitron', sans-serif;
    text-align: center;
    margin-bottom: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    label {
        margin-bottom: 8px;
        color: #e6edf3;
        font-weight: 300;
    }
    input {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #00bcd4;
        background-color: #0d1117;
        color: #e6edf3;
        font-size: 1rem;
        &:focus {
            outline: none;
            border-color: #00e5ff;
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
    }
`;

const SubmitButton = styled(motion.button)`
    padding: 12px 20px;
    font-size: 1.1rem;
    align-self: center;
    width: 50%;
    margin-top: 15px;
    background: linear-gradient(90deg, #00bcd4, #00e5ff);
    color: #0d1117;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(90deg, #00e5ff, #00bcd4);
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.7);
    }

    &:disabled {
        background: #334;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b;
    text-align: center;
    margin-top: 10px;
`;

const CreateGoalForm = ({ onCreateGoal }) => {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Basic validation
            if (!goalName.trim() || !targetAmount) {
                throw new Error("Please fill in all fields.");
            }
            if (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
                throw new Error("Target amount must be a positive number.");
            }

            const res = await API.post('/goals', {
                name: goalName,
                target_amount: parseFloat(targetAmount)
            });
            onCreateGoal(res.data); // Call the prop function to update parent state
            setGoalName('');
            setTargetAmount('');
        } catch (err) {
            console.error("Error creating goal:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || err.message || 'Failed to create goal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Title>Create New Saving Goal</Title>
            <form onSubmit={handleSubmit}>
                <InputGroup>
                    <label htmlFor="goalName">Goal Name:</label>
                    <input
                        id="goalName"
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="e.g., New Laptop, Vacation Fund"
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <label htmlFor="targetAmount">Target Amount:</label>
                    <input
                        id="targetAmount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="e.g., 1200.00"
                        step="0.01"
                        min="0"
                        required
                    />
                </InputGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <SubmitButton
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? 'Creating...' : 'Create Goal'}
                </SubmitButton>
            </form>
        </FormContainer>
    );
};

export default CreateGoalForm;
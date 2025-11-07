import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, generateSavingGrid } from '../utils/helpers';
import API from '../api/api';

const CardContainer = styled(motion.div)`
    background: #1a1e24;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
    border: 1px solid #00bcd4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 280px;
`;

const GoalName = styled.h3`
    color: #00e5ff;
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 10px;
    font-size: 1.5rem;
`;

const GoalDetails = styled.div`
    margin-bottom: 15px;
    p {
        color: #e6edf3;
        margin: 5px 0;
        font-weight: 300;
        span {
            font-weight: 600;
            color: #00bcd4;
        }
    }
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    background-color: #333;
    border-radius: 5px;
    height: 10px;
    overflow: hidden;
    margin-top: 10px;
`;

const ProgressBar = styled(motion.div)`
    height: 100%;
    background: linear-gradient(90deg, #00bcd4, #00e5ff);
    border-radius: 5px;
`;

const Actions = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
`;

const ActionButton = styled(motion.button)`
    background: linear-gradient(90deg, #00bcd4, #00e5ff);
    color: #0d1117;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;

    &:hover {
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
        transform: translateY(-2px);
    }

    &:disabled {
        background: #334;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const AddSavingForm = styled(motion.form)`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    padding: 15px;
    background: #0d1117;
    border-radius: 8px;
    border: 1px solid rgba(0, 229, 255, 0.3);

    input {
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #00bcd4;
        background-color: #1a1e24;
        color: #e6edf3;
        font-size: 0.9rem;
        &:focus {
            outline: none;
            border-color: #00e5ff;
            box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
        }
    }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b;
    font-size: 0.9rem;
    text-align: center;
`;

const SavingGridWrapper = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 20px;
    justify-content: center;
    max-height: 200px; /* Limit height and allow scroll */
    overflow-y: auto;
    padding: 10px;
    border-top: 1px solid rgba(0, 229, 255, 0.1);
    background-color: #0d1117;
    border-radius: 8px;
`;

const SavingCell = styled(motion.div)`
    background: ${(props) => (props.saved ? 'linear-gradient(45deg, #00bcd4, #00e5ff)' : '#334')};
    color: ${(props) => (props.saved ? '#0d1117' : '#e6edf3')};
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: ${(props) => (props.saved ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.saved ? 0.7 : 1)};
    transition: all 0.2s ease;
    border: 1px solid ${(props) => (props.saved ? '#00e5ff' : '#00bcd4')};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px; /* Ensure a minimum width for small amounts */

    &:hover {
        ${(props) => !props.saved && 'transform: translateY(-2px); box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);'}
    }
`;


const GoalCard = ({ goal, onSavingAdded }) => {
    const [showAddSaving, setShowAddSaving] = useState(false);
    const [savingAmount, setSavingAmount] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSavingGrid, setShowSavingGrid] = useState(false);
    const [savingGrid, setSavingGrid] = useState([]);

    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = goal.current_amount >= goal.target_amount;

    useEffect(() => {
        if (goal.target_amount > 0) {
            setSavingGrid(generateSavingGrid(goal.target_amount - goal.current_amount));
        }
    }, [goal.target_amount, goal.current_amount]);

    const handleAddSaving = async (e, amountToAdd = null) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const amount = amountToAdd !== null ? amountToAdd : parseFloat(savingAmount);

        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid positive amount.");
            setLoading(false);
            return;
        }

        try {
            const res = await API.post(`/goals/${goal.id}/savings`, { amount });
            onSavingAdded(res.data); // Notify parent to refresh goals
            setSavingAmount('');
            setShowAddSaving(false);
            setShowSavingGrid(false); // Hide grid after saving
        } catch (err) {
            console.error("Error adding saving:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || err.message || 'Failed to add saving.');
        } finally {
            setLoading(false);
        }
    };

    const handleGridCellClick = async (e, cell) => {
        if (cell.saved) return; // Cannot re-save a 'saved' cell
        await handleAddSaving(e, cell.amount);
        // Optimistically update grid cell as saved
        setSavingGrid(prevGrid => prevGrid.map(item =>
            item.id === cell.id ? { ...item, saved: true } : item
        ));
    };

    return (
        <CardContainer
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
        >
            <GoalName>{goal.name}</GoalName>
            <GoalDetails>
                <p>Target: <span>{formatCurrency(goal.target_amount)}</span></p>
                <p>Saved: <span>{formatCurrency(goal.current_amount)}</span></p>
                <p>Remaining: <span>{formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}</span></p>
            </GoalDetails>

            <ProgressBarContainer>
                <ProgressBar
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </ProgressBarContainer>
            <p style={{textAlign: 'right', fontSize: '0.9rem', color: '#00e5ff', marginTop: '5px'}}>
                {Math.min(100, progress).toFixed(1)}% Completed
            </p>

            {isCompleted ? (
                <p style={{ color: '#00e5ff', textAlign: 'center', marginTop: '20px', fontWeight: '600' }}>
                    Goal Achieved! Congratulations!
                </p>
            ) : (
                <Actions>
                    <ActionButton
                        onClick={() => {
                            setShowAddSaving(!showAddSaving);
                            setShowSavingGrid(false); // Hide grid if manual form is shown
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {showAddSaving ? 'Cancel' : 'Add Saving Manually'}
                    </ActionButton>
                    <ActionButton
                        onClick={() => {
                            setShowSavingGrid(!showSavingGrid);
                            setShowAddSaving(false); // Hide manual form if grid is shown
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {showSavingGrid ? 'Hide Grid' : 'Save Using Grid'}
                    </ActionButton>
                </Actions>
            )}

            <AnimatePresence>
                {showAddSaving && !isCompleted && (
                    <AddSavingForm
                        onSubmit={handleAddSaving}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <input
                            type="number"
                            placeholder="Amount to save"
                            step="0.01"
                            min="0.01"
                            value={savingAmount}
                            onChange={(e) => setSavingAmount(e.target.value)}
                            required
                        />
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <ActionButton
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: '5px' }}
                        >
                            {loading ? 'Saving...' : 'Confirm Saving'}
                        </ActionButton>
                    </AddSavingForm>
                )}

                {showSavingGrid && !isCompleted && (
                    <SavingGridWrapper
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflowY: 'auto' }}
                    >
                        {savingGrid.length > 0 ? (
                            savingGrid.map((cell) => (
                                <SavingCell
                                    key={cell.id}
                                    saved={cell.saved}
                                    onClick={(e) => !cell.saved && handleGridCellClick(e, cell)}
                                    whileHover={!cell.saved ? { scale: 1.05 } : {}}
                                    whileTap={!cell.saved ? { scale: 0.95 } : {}}
                                >
                                    {formatCurrency(cell.amount)}
                                </SavingCell>
                            ))
                        ) : (
                            <p style={{ color: 'rgba(230,237,243,0.7)', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                                Not enough remaining to generate a grid. Add manually.
                            </p>
                        )}
                         {error && <ErrorMessage>{error}</ErrorMessage>}
                    </SavingGridWrapper>
                )}
            </AnimatePresence>
        </CardContainer>
    );
};

export default GoalCard;
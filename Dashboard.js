import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import GoalCard from './GoalCard';
import CreateGoalForm from './CreateGoalForm';
import { formatCurrency } from '../utils/helpers'; // Import formatCurrency
const DashboardContainer = styled.div`
    padding: 40px;
    background: #0d1117;
    min-height: 100vh;
    color: #e6edf3;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 229, 255, 0.2);
`;

const Title = styled.h1`
    color: #00e5ff;
    font-size: 2.5rem;
    font-family: 'Orbitron', sans-serif;
`;

const WelcomeText = styled.p`
    font-size: 1.1rem;
    span {
        font-weight: 600;
        color: #00bcd4;
    }
`;

const GoalsSection = styled.div`
    width: 100%;
    max-width: 1200px;
    margin-top: 30px;
`;

const SectionTitle = styled.h2`
    color: #00bcd4;
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 25px;
    text-align: center;
`;

const GoalsGridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
`;

const MotivationalPhrase = styled(motion.p)`
    font-size: 1.2rem;
    font-style: italic;
    color: rgba(230, 237, 243, 0.7);
    margin-top: 20px;
    text-align: center;
`;

const phrases = [
    "Every rupee saved is a step closer to your dreams.",
    "Building wealth, one brick at a time!",
    "Your future self will thank you for this.",
    "Consistency is the key to financial freedom.",
    "Watch your money grow!",
    "Small savings, big dreams. You're doing great!",
];

const Dashboard = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateGoal, setShowCreateGoal] = useState(false);
    const [currentMotivationalPhrase, setCurrentMotivationalPhrase] = useState('');

    const fetchGoals = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get('/goals');
            setGoals(res.data);
        } catch (err) {
            console.error("Error fetching goals:", err);
            setError("Failed to load goals.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
        const interval = setInterval(() => {
            setCurrentMotivationalPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        }, 10000); // Change phrase every 10 seconds
        return () => clearInterval(interval);
    }, [fetchGoals]);

    const handleGoalCreated = (newGoal) => {
        setGoals((prevGoals) => [newGoal, ...prevGoals]);
        setShowCreateGoal(false);
    };

    const handleSavingAdded = (updatedGoal) => {
        setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
        );
    };

    if (loading) return <DashboardContainer>Loading goals...</DashboardContainer>;
    if (error) return <DashboardContainer>Error: {error}</DashboardContainer>;

    const totalSaved = goals.reduce((acc, goal) => acc + parseFloat(goal.current_amount), 0);
    const totalTarget = goals.reduce((acc, goal) => acc + parseFloat(goal.target_amount), 0);

    const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return (
        <DashboardContainer>
            <Header>
                <Title>Money Saver</Title>
                <WelcomeText>
                    Welcome, <span>{user?.username}!</span>
                </WelcomeText>
            </Header>

            <SectionTitle>Your Current Progress</SectionTitle>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    backgroundColor: '#1a1e24',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 0 25px rgba(0, 229, 255, 0.2)',
                    marginBottom: '40px',
                    border: '1px solid #00bcd4',
                    textAlign: 'center',
                }}
            >
                <h3>Total Saved: {formatCurrency(totalSaved)}</h3>
                <h3>Total Target: {formatCurrency(totalTarget)}</h3>
                <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '5px', height: '20px', overflow: 'hidden', marginTop: '15px' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                            height: '100%',
                            backgroundColor: 'linear-gradient(90deg, #00bcd4, #00e5ff)',
                            background: '#00e5ff', // Fallback, use gradient in styled-components
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '10px',
                            color: '#0d1117',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                        }}
                    >
                        {progress.toFixed(1)}%
                    </motion.div>
                </div>
                <AnimatePresence mode="wait">
                    {currentMotivationalPhrase && (
                        <MotivationalPhrase
                            key={currentMotivationalPhrase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {currentMotivationalPhrase}
                        </MotivationalPhrase>
                    )}
                </AnimatePresence>
            </motion.div>

            <GoalsSection>
                <SectionTitle>Your Goals</SectionTitle>
                <button onClick={() => setShowCreateGoal(!showCreateGoal)}>
                    {showCreateGoal ? 'Cancel' : 'Create New Goal'}
                </button>

                <AnimatePresence>
                    {showCreateGoal && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden', marginTop: '20px' }}
                        >
                            <CreateGoalForm onCreateGoal={handleGoalCreated} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <GoalsGridContainer>
                    <AnimatePresence>
                        {goals.length === 0 ? (
                            <p style={{ width: '100%', textAlign: 'center', margin: '50px 0' }}>
                                You haven't set any goals yet. Start saving!
                            </p>
                        ) : (
                            goals.map((goal) => (
                                <GoalCard key={goal.id} goal={goal} onSavingAdded={fetchGoals} />
                            ))
                        )}
                    </AnimatePresence>
                </GoalsGridContainer>
            </GoalsSection>
        </DashboardContainer>
    );
};

export default Dashboard;

// ''' **ACTION:** Note the usage of `formatCurrency` for displaying `totalSaved` and `totalTarget`.
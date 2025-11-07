import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';

const BadgesContainer = styled.div`
    padding: 40px;
    background: #0d1117;
    min-height: 100vh;
    color: #e6edf3;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h1`
    color: #00e5ff;
    font-size: 2.5rem;
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 40px;
    text-align: center;
`;

const BadgesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    width: 100%;
    max-width: 1000px;
    margin-top: 30px;
`;

const BadgeCard = styled(motion.div)`
    background: #1a1e24;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
    border: 1px solid #00bcd4;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const BadgeIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 15px;
    color: ${(props) => (props.unlocked ? '#FFD700' : '#444')}; /* Gold if unlocked, grey if locked */
    filter: ${(props) => (props.unlocked ? 'drop-shadow(0 0 10px #FFD700)' : 'none')};
    transition: all 0.3s ease;
`;

const BadgeName = styled.h3`
    color: #00e5ff;
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 10px;
    font-size: 1.2rem;
`;

const BadgeDescription = styled.p`
    color: #e6edf3;
    font-size: 0.9rem;
    margin-bottom: 15px;
    opacity: ${(props) => (props.unlocked ? 1 : 0.6)};
`;

const BadgeDate = styled.p`
    font-size: 0.8rem;
    color: #00bcd4;
    font-style: italic;
    margin-top: 10px;
`;

const NoBadgesMessage = styled.p`
    color: rgba(230, 237, 243, 0.7);
    font-size: 1.2rem;
    margin-top: 50px;
    text-align: center;
    width: 100%;
`;

const BadgesDisplay = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                setLoading(true);
                const res = await API.get('/badges'); // Assuming you have a /badges endpoint
                setBadges(res.data);
            } catch (err) {
                console.error("Error fetching badges:", err);
                setError("Failed to load badges.");
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, []);

    if (loading) return <BadgesContainer>Loading badges...</BadgesContainer>;
    if (error) return <BadgesContainer>Error: {error}</BadgesContainer>;

    return (
        <BadgesContainer>
            <Title>Your Achievements</Title>
            <BadgesGrid>
                <AnimatePresence>
                    {badges.length === 0 ? (
                        <NoBadgesMessage>
                            You haven't earned any badges yet. Keep saving to unlock new achievements!
                        </NoBadgesMessage>
                    ) : (
                        badges.map((badge) => (
                            <BadgeCard
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)' }}
                            >
                                <BadgeIcon unlocked={badge.unlocked}>🏆</BadgeIcon> {/* Use a relevant icon */}
                                <BadgeName>{badge.name}</BadgeName>
                                <BadgeDescription unlocked={badge.unlocked}>{badge.description}</BadgeDescription>
                                {badge.unlocked && badge.unlocked_date && (
                                    <BadgeDate>Unlocked: {new Date(badge.unlocked_date).toLocaleDateString()}</BadgeDate>
                                )}
                            </BadgeCard>
                        ))
                    )}
                </AnimatePresence>
            </BadgesGrid>
        </BadgesContainer>
    );
};

export default BadgesDisplay;
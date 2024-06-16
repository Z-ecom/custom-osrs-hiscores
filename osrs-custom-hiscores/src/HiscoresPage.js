import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed: npm install axios

const HiscoresPage = () => {
    const [cachedHiscores, setCachedHiscores] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    useEffect(() => {
        const fetchHiscores = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3001/api/hiscores');
                setCachedHiscores(response.data);
            } catch (error) {
                setError('Error fetching hiscores');
                console.error('Error fetching hiscores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHiscores();
    }, [currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Top Players</h1>
            {Object.keys(cachedHiscores).map((skill) => (
                <div key={skill}>
                    <h2>{skill}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Level</th>
                                <th>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cachedHiscores[skill].map((player, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{player.username}</td>
                                    <td>{player.level}</td> {/* Ensure player.level is defined */}
                                    <td>{player.xp}</td> {/* Ensure player.xp is defined */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default HiscoresPage;
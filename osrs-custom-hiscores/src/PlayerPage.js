import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is installed: npm install axios


const PlayerPage = () => {
    const { username } = useParams();
    const [playerData, setPlayerData] = useState({});

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/player/${username}`); // Adjust URL as per your server
                setPlayerData(response.data);
            } catch (error) {
                console.error(`Error fetching data for ${username}:`, error);
            }
        };

        fetchPlayerData();
    }, [username]);

    return (
        <div className="skill-page"> {/* Apply the skill-page class to maintain consistent styling */}
            <div className="sidebar">
                {/* You can add sidebar content here if needed */}
            </div>
            <div className="main-content">
                <div className="skill-navigation">
                    <h2>{username}'s Hiscores</h2>
                </div>
                <div className="skill-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Skill</th>
                                <th>Rank</th>
                                <th>Level</th>
                                <th>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(playerData).map(([skill, data]) => (
                                <tr key={skill}>
                                    <td><Link to={`/api/skill/${data.skill}`}>{data.skill}</Link></td>
                                    <td>{data.rank}</td>
                                    <td>{data.level}</td>
                                    <td>{data.xp.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
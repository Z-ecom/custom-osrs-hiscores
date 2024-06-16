import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';


const SkillPage = () => {
    const { skillName } = useParams();
    const [skillRanks, setSkillRanks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // List of all skills
    const skills = [
        'Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 'Prayer', 'Magic',
        'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing',
        'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer', 'Farming', 'Runecrafting',
        'Hunter', 'Construction'
    ];

    // Function to fetch skill ranks based on current page
    const fetchSkillRanks = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/skill/${skillName}?page=${currentPage}`);
            setSkillRanks(response.data);
            // Assuming the server responds with total pages information
            setTotalPages(response.headers['x-total-pages']);
        } catch (error) {
            console.error(`Error fetching ${skillName} ranks:`, error);
        }
    };

    useEffect(() => {
        fetchSkillRanks();
    }, [skillName, currentPage]);

    // Handler for changing page number
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handler for input change in the page number textbox
    const handlePageInputChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            value = 1; // Default to page 1 if input is invalid
        }
        setCurrentPage(value);
    };

    return (
        <div className="skill-page">
          <div className="sidebar">
            <div className="skill-list">
              <h3>All Skills</h3>
              <ul>
                {skills.map((skill) => (
                  <li key={skill}>
                    <Link to={`/api/skill/${skill}`}>{skill}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="main-content">
            <div className="skill-navigation">
              <div>
                <h2>{skillName} Highscores</h2>
              </div>
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  &lt; Prev
                </button>
                <p>Page: {currentPage}</p>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                  Next &gt;
                </button>
                <input
                  type="text"
                  value={currentPage}
                  onChange={handlePageInputChange}
                  onBlur={() => fetchSkillRanks()} // Fetch new page on blur
                />
              </div>
            </div>
            <div className="skill-table">
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
                  {skillRanks.map((rank, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to={`/api/player/${rank.username}`}>{rank.username}</Link>
                      </td>
                      <td>{rank.level}</td>
                      <td>{rank.xp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

export default SkillPage;

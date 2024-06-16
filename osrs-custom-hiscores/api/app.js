const express = require('express');
const cron = require('node-cron');
const fetchHiscores = require('./fetchHiscores');
const utils = require('./utils');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = process.env.PORT || 3001;
let cachedHiscores = {};
let usernameList = [
    "A Cold One A",
    "Alfiee A",
    "B0aty A",
    "Coxie A",
    "Dino A",
    "Ditter A",
    "Ray AAAA",
    "Eliop14 A",
    "Faux A",
    "Gunschilli A",
    "Jcw A",
    "Mazhar A",
    "MikaRS A",
    "Mmorpg A",
    "Mr Mammal A",
    "Muts A",
    "Odablock A",
    "Pip A",
    "PortKhazardA",
    "Purpp A",
    "Raikesy A",
    "Rhyss A",
    "Roidie A",
    "Sick Nerd A",
    "Skiddler AA",
    "SkillSpecs A",
    "SoloMissionA",
    "Torvesta AA",
    "VtheVictim A",
    "Westham A"
]

// Use cors middleware
app.use(cors());

// Fetch hiscores for a list of usernames
const fetchHiscoresForGroup = async (usernames) => {
    const hiscorePromises = usernames.map(async (username) => {
        try {
            const data = await fetchHiscores(username);
            return { username, hiscores: utils.parseHiscores(data) };
        } catch (error) {
            console.error(`Error fetching hiscores for ${username}:`, error);
            return { username, hiscores: null };
        }
    });
    return await Promise.all(hiscorePromises);
};

// Function to update cached hiscores
const updateCachedHiscores = async () => {    
    try {
        const hiscoreData = await fetchHiscoresForGroup(usernameList);
        cachedHiscores = utils.calculateRanks(hiscoreData);        
    } catch (error) {
        console.error('Failed to update cached hiscores:', error);
    }
};

// Initialize cached hiscores at startup
updateCachedHiscores();

// Schedule fetching hiscores every 5 minutes
cron.schedule('*/5 * * * *', () => {
    updateCachedHiscores();
});

// Serve cached hiscores for all skills
app.get('/api/hiscores', (req, res) => {
    res.json(cachedHiscores);
});

// Serve skill rankings for a specific skill with pagination
app.get('/api/skill/:skillName', (req, res) => {
    const { skillName } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    if (cachedHiscores[skillName]) {
        const skillRanks = cachedHiscores[skillName].slice(startIndex, endIndex); // Get ranks for the specific page
        res.json(skillRanks);
    } else {
        res.status(404).json({ error: `Skill ${skillName} not found` });
    }
});

// Serve all skills for a specific player
app.get('/api/player/:username', (req, res) => {
    const { username } = req.params;
    const playerSkills = [];

    if (cachedHiscores) {
        Object.keys(cachedHiscores).forEach((skill) => {
            const skillData = cachedHiscores[skill].find((entry) => entry.username === username);
            if (skillData) {
                playerSkills.push({ skill, ...skillData });
            }
        });
        res.json(playerSkills);
    } else {
        res.status(404).json({ error: `Player ${username} not found` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
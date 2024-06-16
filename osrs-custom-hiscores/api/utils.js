const parseHiscores = (data) => {
    const lines = data.split('\n');
    const skills = [
        'Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 'Prayer', 'Magic',
        'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing',
        'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer', 'Farming', 'Runecrafting',
        'Hunter', 'Construction'
    ];
    const hiscores = {};
    skills.forEach((skill, index) => {
        const [rank, level, xp] = lines[index].split(',').map((val) => parseInt(val, 10)); // Parse strings to integers
        hiscores[skill] = { rank, level, xp };
    });

        
    return hiscores;
};

const calculateRanks = (hiscoreData) => {
    const ranks = {};

    // Aggregate XP values for each skill across all usernames
    const skillXP = {};
    hiscoreData.forEach(({ username, hiscores }) => {
        Object.keys(hiscores).forEach((skill) => {
            const { xp, level, rank } = hiscores[skill];
            if (!skillXP[skill]) {
                skillXP[skill] = [];
            }
            skillXP[skill].push({ username, xp, level, rank });
        });
    });

    // Sort XP values for each skill and assign ranks
    Object.keys(skillXP).forEach((skill) => {
        // Sort XP values in descending order
        skillXP[skill].sort((a, b) => b.xp - a.xp);

         // Sort by level if sortByLevel is true and skill is 'Overall'
         if (skill === 'Overall') {
            skillXP[skill].sort((a, b) => b.level - a.level);
        }

        // Assign ranks based on sorted order
        skillXP[skill].forEach((entry, index) => {
            const { username, xp, level, rank } = entry;
            const currentRank = index + 1;
            if (!ranks[skill]) {
                ranks[skill] = [];
            }
            ranks[skill].push({ username, xp, level, rank: currentRank });
        });
    });

    return ranks;
};

module.exports = { parseHiscores, calculateRanks };
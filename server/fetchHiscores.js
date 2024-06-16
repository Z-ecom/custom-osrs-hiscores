// Use dynamic import to import node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fetchHiscores = async (username) => {
    const url = `https://secure.runescape.com/m=hiscore_oldschool_tournament/index_lite?player=${username}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch hiscores for ${username}`);
    }
    return await response.text();
};

module.exports = fetchHiscores;